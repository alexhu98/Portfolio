# Google and Firebase Authentication
##### Octember 16th, 2020 By Alex Hu

The mobile app uses the tabs interface to switch between the calendar tab and the device tab.
In additional to tapping the tab button, I found myself trying to swipe between tabs but it is
not a default action provided by the framework.

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
Otherwise, the app will just show a blank screen and

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
There is a small moment in time when the app is being initialized and the authentication status is not known yet. During
this moment, neither the login button nor the profile image are displayed, and it is guarded by the isAuthReady() function.

```
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>{{ today$ | async }}</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="signIn()" *ngIf="isAuthReady() && !getProfileImage()">Login</ion-button>
      <ion-thumbnail (click)="signOut()" *ngIf="isAuthReady() && getProfileImage()">
        <ion-img [src]="getProfileImage()"></ion-img>
      </ion-thumbnail>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
```
The component simply forwards the calls to the AuthenticationService.
```js
export class Tab1Page extends SwipeTabPage {

  constructor(
    private authService: AuthenticationService,
  ) {}

  isAuthReady()     { return this.authService.isReady(); }
  getProfileImage() { return this.authService.getProfileImage(); }
  async signIn()    { await this.authService.signIn(); }
  async signOut()   { await this.authService.signOut(); }
}
```

### Authentication Service

I followed this article
[How to Add Firebase Authentication in Ionic 5 App](https://www.positronx.io/ionic-firebase-authentication-tutorial-with-examples/)
to set up my AuthenticationService.

In the signIn() function, it first checks if the app is running in the capacitor platform (i.e. the Android platform).
If it is, then googlePlus.trySilentLogin() is first called in case if the app has already signed in previously,
and then googlePlus.login() for a full sign in procedure. Both calls apply the webClientId option will return
the idToken to be used in the call to angularFireAuth.signInWithCredential().

If the app is running inside the browser platform, it will bypass the cordova plugin and call the browser version
```js
angularFireAuth.signInWithPopup(new auth.GoogleAuthProvider())
```
directly. When the sign-in process is finished, the user information will be received via the subscription to
the angularFireAuth.authState.
```js
this.angularFireAuth.authState.subscribe(user => {
  console.log(`AuthenticationService -> authState -> user`, user)
  this.ready = true;
  this.userData = user;
  localStorage.setItem('user', user ? JSON.stringify(this.userData) : null);
})
```
Upon sign out, the same subscription will receive a null user, the stored user data will be removed.

Here is the full code of the AuthenticationService. There are plenty of console logging as the whole
process has to go to an outside network and the timing is quite unpredictable. The logging will help
understand flow of sign in process.
```js
import { Injectable, OnDestroy } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { isPlatform } from '@ionic/angular'
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SubSink } from 'subsink'
import { environment } from '../../environments/environment';

const WEB_CLIENT_ID = environment.googlePlusConfig.webClientId;

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService implements OnDestroy {

  private ready = false;
  private userData: any;
  private subs = new SubSink()

  constructor(
    private googlePlus: GooglePlus,
    public angularFireAuth: AngularFireAuth,
  )
  {
    this.subs.add(this.angularFireAuth.authState.subscribe(user => {
      console.log(`AuthenticationService -> authState -> user`, user)
      this.ready = true;
      this.userData = user;
      localStorage.setItem('user', user ? JSON.stringify(this.userData) : null);
    }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  isReady(): boolean {
    return this.ready;
  }

  getProfileImage(): string {
    return this.userData?.photoURL || '';
  }

  isSignedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return !!user;
  }

  // Sign in with Google
  async signIn() {
    try {
      const isCapacitorPlatform = isPlatform('capacitor');
      console.log(`AuthenticationService -> signIn -> isCapacitorPlatform =`, isCapacitorPlatform)
      if (isCapacitorPlatform) {
        const options = {
          webClientId: WEB_CLIENT_ID,
          offline: false,
        };

        let result;
        try {
          console.log(`AuthenticationService -> signIn -> googlePlus.trySilentLogin -> calling`)
          result = await this.googlePlus.trySilentLogin(options)
          console.log(`AuthenticationService -> signIn -> googlePlus.trySilentLogin -> result`, result)
        }
        catch (ex) {
          console.error(`AuthenticationService -> signIn -> googlePlus.trySilentLogin -> ex`, ex)
        }
        if (!result) {
          console.log(`AuthenticationService -> signIn -> googlePlus.login -> calling`)
          result = await this.googlePlus.login(options)
          console.log(`AuthenticationService -> signIn -> googlePlus.login -> result`, result)
        }
        console.log(`AuthenticationService -> signIn -> signInWithCredential -> calling`)
        result = await this.angularFireAuth.signInWithCredential(auth.GoogleAuthProvider.credential(result.idToken))
        console.log(`AuthenticationService -> signIn -> signInWithCredential -> result`, result)
      }
      else {
        console.log(`AuthenticationService -> signIn -> signInWithPopup -> calling`)
        const result = await this.angularFireAuth.signInWithPopup(new auth.GoogleAuthProvider())
        console.log(`AuthenticationService -> signIn -> signInWithPopup -> result`, result)
      }
    }
    catch (ex) {
      console.error(`AuthenticationService -> signIn -> ex`, ex)
    }
  }

  // Sign-out
  async signOut() {
    try {
      this.ready = false;
      this.userData = undefined;
      localStorage.removeItem('user')
      console.log(`AuthenticationService -> signOut -> calling`)
      await this.angularFireAuth.signOut()
    }
    catch (ex) {
      console.log(`AuthenticationService -> signOut -> ex`, ex)
    }
  }
}
```
