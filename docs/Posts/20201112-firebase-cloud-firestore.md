# Firebase Cloud Firestore
##### November 12th, 2020 By Alex Hu

[Cloud Firestore](https://firebase.google.com/docs/firestore/) is a flexible, scalable database for mobile, web,
and server development from Firebase and Google Cloud Platform.

Setting up the app with Firebase is easy enough. There are plenty of tutorial on this topic, like this one:
[Ionic CRUD Operations Using Firebase with Firestore](https://www.freakyjolly.com/ionic-firebase-crud-operations/)

### [AngularFireAuth](https://github.com/angular/angularfire)

We already have the Google Plus authentication working. All we have to do is to exchange the id token for a
Firebase user id with the signInWithCredential() method.

```js
import { AngularFireAuth } from '@angular/fire/auth'
import * as firebase from 'firebase'

interface UserData {
  ready: boolean;
  signedIn: boolean;
  userId: string,
  name: string;
  profileImage: string;
  idToken: string;
  accessToken: string;
  expiresAt: number;
}
...
export class AuthenticationService implements OnDestroy {
  ...

  constructor(
    private ngZone: NgZone,
    private googlePlus: GooglePlus,
    private googleAuthService: GoogleAuthService,
    private fireAuth: AngularFireAuth,
  )

  updateUserDataByGoogleAuth(user: gapi.auth2.GoogleUser, authResponse: gapi.auth2.AuthResponse) {
    ...
    this.emit(userData);
    if (!userId) {
      this.updateUserDataWithFireAuth(userData);
    }
  }

  updateUserDataWithFireAuth(userData: UserData) {
    this.fireAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(userData.idToken, userData.accessToken))
      .then(credential => {
        userData.userId = credential.user.uid;
        this.emit(userData);
      })
  }
```

### Note Service

There are a couple of ways to assocate the user id with our notes collection in Firestore.
I picked this approach: [Model Relational Data in Firestore NoSQL](https://www.youtube.com/watch?v=jm66TSlVtcc) ,
because of the flexible structure for compound queries.

```js
import { Injectable, NgZone, OnDestroy, Query } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import * as firebase from 'firebase'
import { AuthenticationService } from './authentication.service'
import { BehaviorSubject } from 'rxjs'
import { SubSink } from 'subsink'

interface Note {
  id: string;
  content: string;
  updatedAt: firebase.firestore.Timestamp;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService implements OnDestroy {

  refresh$ = new BehaviorSubject<any>(null);
  notes$ = new BehaviorSubject<Note[]>([]);

  private subs = new SubSink();

  constructor(
    private ngZone: NgZone,
    private db: AngularFirestore,
    private authenticationService: AuthenticationService
  ) {
    this.subs.add(this.refresh$.subscribe(async () => await this.queryAll()));
    this.subs.add(this.authenticationService.user$.subscribe(() => this.refresh()));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  refresh(): void {
    this.refresh$.next(null);
  }

  async queryAll() {
    const userData = this.authenticationService.user$.getValue();
    if (userData.signedIn && userData.userId) {
      this.db.collection('notes').ref.where('userId', '==', userData.userId).orderBy('updatedAt', 'desc').get().then(docs => {
        const notes = []
        docs.forEach(doc => {
          notes.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        this.emit(notes);
      });
    }
  }

  async update(id: string, content: string): Promise<void> {
    const now = firebase.firestore.Timestamp.fromDate(new Date());
    if (id) {
      await this.db.collection('notes').doc(id).update({
        content,
        updatedAt: now,
      });
    }
    else {
      const userData = this.authenticationService.user$.getValue();
      if (userData.signedIn && userData.userId) {
        await this.db.collection('notes').add({
          userId: userData.userId,
          content,
          updatedAt: now,
        });
      };
    }
    this.refresh();
  }

  async remove(id: string): Promise<void> {
    await this.db.collection('notes').doc(id).delete();
    this.refresh();
  }

  emit(notes: Note[]): void {
    this.ngZone.run(() => {
      this.notes$.next(notes);
    });
  }
}
```
