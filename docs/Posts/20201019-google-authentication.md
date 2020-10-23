# Google Authentication
##### Octember 19th, 2020 By Alex Hu

As I experienced in
[Ionic with Firebase Authentication](https://portfolio.alexhu.vercel.app/posts/ionic-with-firebase-authentication) ,
the normal browser based Firebase Authentication does not work in the Android platform.
So we have to use a Ionic Native plugin to support Google sign in. Note that there is
[calendar plugin](https://ionicframework.com/docs/native/calendar/), it only gets the calendar on the phone device
and it would not work in the browser platform. So I thought I would go the full Google sign in route and
then retreve the calendar using the [Google Calendar API](https://developers.google.com/calendar/). It also open
up the possibility to other Google or Firebase services that require user authentication. Having the mobile app
works in both platforms are also much preferred as changes is much easier to observe in the browser platform,
before the changes eventually are verified in the Android platform.

### [Google Plus](https://ionicframework.com/docs/native/google-plus)

Installing the Google Plus plugin for capacitor is easy enough.
```
npm install cordova-plugin-googleplus
npm install @ionic-native/google-plus
ionic cap sync
```

### [Google Sign-In Cordova/PhoneGap Plugin](https://github.com/EddyVerbruggen/cordova-plugin-googleplus)

I wish I could say simply follow the instruction and everything just work, but things are never simple
when it comes to authentication.

1. widget id in config.xml

First thing first, update your config.xml and add the id. I am not sure if it is necessary as I don't see
the id in the widget. Perhaps they removed it in the correct ionic implementation. No harm done to add it as
per the plugin instruction.
```
<?xml version='1.0' encoding='utf-8'?>
<widget id="** REPLACE THIS VALUE **" ...>
...
</widget>
```

2. keystore

Sooner or later, you will need to generate a keystore for signing the app, and the SHA-1 inside the keystore will
also be needed to create the Android credential. The following command will generate a keystore named 'main.keystore'.
You can substitute the ALIAS with your own alias name.

This tutorial titled
[Google Login with Capacitor and Ionic natively Part 1 - Ionic 5 / React / Firebase](https://youtu.be/pVfAAfwxFoI?t=192)
has an excellent step-by-step instruction on this procedure. The keystore instruction is after the 3:12 minute mark.

```
keytool -genkey -keystore main.keystore -v -alias ALIAS -keyalg RSA -keysize 2048 -validity 10000
```
After the keystore is generated, you can find the SHA-1 signature from the output of the following command.
```
keytool" -keystore main.keystore -list -v
```

3. build.gradle

I moved my keystore into the android\app folder where the build.gradle is located, and add the following signingConfigs
under the Android property.

```
apply plugin: 'com.android.application'

android {
    ...
    signingConfigs {
        release {
            storeFile file("main.keystore")
            storePassword "12345678"
            keyAlias 'ALIAS'
            keyPassword '12345678'
        }
        debug {
            storeFile file("main.keystore")
            storePassword "12345678"
            keyAlias 'ALIAS'
            keyPassword '12345678'
        }
    }
}
```

4. [Google Cloud Platform](https://console.developers.google.com/)

In the last sprint, I already set up a Google developer account. You can refer to this video
[How To Use The Google Calendar API In Node.js](https://youtu.be/zrLf4KMs71E?t=211)
to setup your app. For my purpose, I also need to setup the Web client in additional to the Android client
because I want to make use of the Firebase authentication and its service. We will come back to the
[Google Cloud Platform](https://console.developers.google.com/) to get the credential information later.

Once you get the developer account, the beginning of this
[Google Login with Capacitor and Ionic natively Part 1 - Ionic 5 / React / Firebase](https://youtu.be/pVfAAfwxFoI)
video will guide you through setting up a OAuth client credential for the Android app, which will require the SHA-1
that listed in the keystore.

So at this point, I have 2 entries under the Credentials / OAuth 2.0 Client IDs. One for my Android app and
the other for the Web application.


### Mobile App Module and Template

1. app.module.ts

Before I forget, let me mention that we need to include GooglePlus as a provider the app.module.ts.
Otherwise, the app will just show a blank screen and give you a empty feeling. The console log shows
this error message.
```
NullInjectorError: No provider for GooglePlus
```
Fixing the problem is easy, just import the GooglePlus and add it to the list of providers.
```js
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ...
  ],
  providers: [
    ...
    GooglePlus,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

2. html template

In the html template, I added a Login button which is replaced by the profile image that also served as the log out button.
There is a moment when the app is being initialized and the authentication status is not known yet. During this time,
neither the login button nor the profile image are displayed, and it is guarded by the user.ready variable.

```
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>{{ today$ | async }}</ion-title>
    <ion-buttons slot="end" *ngIf="user$ | async as user">
      <ion-button (click)="signIn()" *ngIf="user.ready && !user.signedIn">Sign In</ion-button>
      <ion-thumbnail (click)="signOut()" *ngIf="user.ready && user.signedIn">
        <ion-img [src]="user.profileImage" alt='Sign Out'></ion-img>
      </ion-thumbnail>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
```

### Authentication Service

I followed this article
[How to Add Firebase Authentication in Ionic 5 App](https://www.positronx.io/ionic-firebase-authentication-tutorial-with-examples/)
to set up my AuthenticationService.

In the signIn() function, it first checks if the app is running in the capacitor platform (i.e. the Android platform).
If it is, then googlePlus.trySilentLogin() is first called in case if the app has already signed in previously,
and then googlePlus.login() for a full sign in procedure. Both calls apply the webClientId option will return
the idToken to be used in the call to angularFireAuth.signInWithCredential().

If the app is running inside the browser platform, it will bypass the cordova plugin and call the browser version.
Upon sign out, the same subscription will receive a null user, and the stored user data will be removed.

Here is the full code of the AuthenticationService. I am only implementing the Google sign-in as my
calendar service is hosted by Google.
```js
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { isPlatform } from '@ionic/angular'
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { GoogleAuthService } from 'ng-gapi'
import { BehaviorSubject } from 'rxjs'
import { SubSink } from 'subsink'
import { environment } from '../../environments/environment';

const WEB_CLIENT_ID = environment.googlePlusConfig.webClientId;

const GOOGLE_PLUS_OPTIONS = {
  webClientId: WEB_CLIENT_ID,
  offline: false,
};

interface UserData {
  ready: boolean;
  signedIn: boolean;
  name: string;
  profileImage: string;
  idToken: string;
  accessToken: string;
  expiresAt: number;
}

const NOT_READY_USER_DATA: UserData = {
  ready: false,
  signedIn: false,
  name: '',
  profileImage: '',
  idToken: '',
  accessToken: '',
  expiresAt: 0,
}

const NOT_SIGNED_IN_USER_DATA: UserData = {
  ready: true,
  signedIn: false,
  name: '',
  profileImage: '',
  idToken: '',
  accessToken: '',
  expiresAt: 0,
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {

  user$ = new BehaviorSubject<UserData>(NOT_READY_USER_DATA);

  private googleAuth: gapi.auth2.GoogleAuth = undefined;
  private googleUser: gapi.auth2.GoogleUser = undefined;
  private subs = new SubSink()

  constructor(
    private ngZone: NgZone,
    private googlePlus: GooglePlus,
    private googleAuthService: GoogleAuthService,
  )
  {
    if (this.isAndroid()) {
      this.googlePlus.trySilentLogin(GOOGLE_PLUS_OPTIONS)
        .then((result: any) => {
          this.updateUserDataByGooglePlus(result)
        })
        .catch((ex: any) => {
          console.error(`AuthenticationService -> googlePlus.trySilentLogin -> ex`, ex)
          this.emit(NOT_SIGNED_IN_USER_DATA);
        });
    }
    else {
      this.subs.add(this.googleAuthService.getAuth().subscribe(auth => {
        this.googleAuth = auth;
        const user = auth.currentUser.get();
        if (user.isSignedIn()) {
          this.googleUser = user;
          this.updateUserDataByGoogleAuth(this.googleUser, this.googleUser.getAuthResponse());
        }
        else {
          this.emit(NOT_SIGNED_IN_USER_DATA);
        }
      }));
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Sign in with Google
  async signIn() {
    if (this.isAndroid()) {
      let result: any;
      try {
        result = await this.googlePlus.trySilentLogin(GOOGLE_PLUS_OPTIONS)
      }
      catch (ex) {
        console.error(`AuthenticationService -> signIn -> googlePlus.trySilentLogin -> ex`, ex)
      }
      try {
        if (!result) {
          result = await this.googlePlus.login(GOOGLE_PLUS_OPTIONS)
        }
      }
      catch (ex) {
        console.error(`AuthenticationService -> signIn -> googlePlus.login -> ex`, ex)
      }
      if (result) {
        this.updateUserDataByGooglePlus(result);
      }
    }
    else if (this.googleAuth) {
      try {
        this.googleUser = await this.googleAuth.signIn();
        this.updateUserDataByGoogleAuth(this.googleUser, this.googleUser.getAuthResponse());
      }
      catch (ex) {
        console.error(`AuthenticationService -> googleAuth.signIn -> ex =`, ex)
      }
    }
  }

  // Sign-out
  async signOut() {
    this.emit(NOT_SIGNED_IN_USER_DATA);
    localStorage.removeItem('user')
    if (this.isAndroid()) {
      try {
        await this.googlePlus.logout();
      }
      catch (ex) {
        console.error(`AuthenticationService -> googlePlus.logout -> ex`, ex)
      }
    }
    else if (this.googleAuth) {
      try {
        await this.googleAuth.signOut()
      }
      catch (ex) {
        console.error(`AuthenticationService -> googleAuth.signOut -> ex`, ex)
      }
    }
  }

  getAccessToken() {
    return this.user$.getValue()?.accessToken;
  }

  emit(userData: UserData) {
    this.ngZone.run(() => {
      this.user$.next(userData);
    });
  }

  isAndroid(): boolean {
    return isPlatform('capacitor');
  }

  updateUserDataByGooglePlus(result: any) {
    const userData = {
      ready: true,
      signedIn: true,
      name: result.displayName,
      profileImage: result.imageUrl,
      idToken: result.idToken,
      accessToken: result.accessToken,
      expiresAt: result.expires,
    };
    this.emit(userData);
  }

  updateUserDataByGoogleAuth(user: gapi.auth2.GoogleUser, authResponse: gapi.auth2.AuthResponse) {
    const userData = {
      ready: true,
      signedIn: true,
      name: user.getBasicProfile().getName(),
      profileImage: user.getBasicProfile().getImageUrl(),
      idToken: authResponse.id_token,
      accessToken: authResponse.access_token,
      expiresAt: authResponse.expires_at,
    }
    this.emit(userData);
  }
}
```
