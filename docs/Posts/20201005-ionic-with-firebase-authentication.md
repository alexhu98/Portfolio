# Ionic with Firebase Authentication
##### Octember 5th, 2020 By Alex Hu

While the Google Calendar API works with Node.js, I want to move the logic to the mobile app.
In order to access the calendar, the mobile app need to have authentication logic to access
the Google account.

### [How to Add Firebase Authentication in Ionic 5 App](https://www.positronx.io/ionic-firebase-authentication-tutorial-with-examples/)

Firebase Authentication is in my to-learn list and it is the right time to implement it. The step-by-step instruction
works quite well with some minor adjustment. The authentication works inside the browser environment.
I can log in and retrieve my profile picture without problem.

Sadly, it failed inside the Android environment. When the log in button is clicked, the Android app would
launch the browser app for the Google account login, but would not return to my app afterward.
If I close the browser app, my Android app is still in the previous state pending log in. That's not good.

From all indications, it appears that the authentication is going to need a Cordova plugin and accessing the
calendar will need another one.

- [Google+ Cordova/PhoneGap Plugin](https://www.npmjs.com/package/cordova.plugin.googleplus)
- [PhoneGap Calendar plugin](https://www.npmjs.com/package/cordova-plugin-calendar)

Such is the limitation of hybrid app when the normal Javascript script expect a normal browser environment
but the hybrid app is in another environment. For now, I would stick to fetching the Google calender events
from the server side and feed them through HTTP GET. As the app mature more, I may explore the Cordova plugins.
