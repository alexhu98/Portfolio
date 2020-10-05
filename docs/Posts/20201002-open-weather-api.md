# Open Weather API
##### Octember 2nd, 2020 By Alex Hu

Ionic Framework is an open source mobile UI toolkit for building high quality, cross-platform native and web app experiences.
Move faster with a single codebase, running everywhere.

@ionic/angular combines the core Ionic experience with the tooling and APIs that are tailored to Angular Developers.

[ionic start](https://ionicframework.com/docs/cli/commands/start)

Starting the ionic project is easy enough. After downloading the ionic cli, you just need to run this command:
```
ionic start my-assistant tabs --type=angular --capacitor
```
Then it is about learning the in-and-out of [ionic components](https://ionicframework.com/docs/components)
as well as Angular itself.

You can generate components and services with the normal ng commands like 'ng g c' and 'ng g s' or use the
ionic version of them 'ionic g c' and 'ionic g s'.

### [Open Weather API](https://openweathermap.org/api)

The first component I want for my app is a simple weather component that show the current temperature and
the forecast of the next few days.

Open Weather provides a free tier of service, and it is easy to work with. Just get a API key and you are in.

The next step is to find out how state is managed in Angular with service, as well as making HTTP call.
It tooks me a while to figure out how everything wire together, i.e. service, module, component, html template.
While it is certainly nice to have a place where for each responible party, it is a bit tough to separate them
over 7 files!

```js
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const OPEN_WEATHER_URL = 'http://api.openweathermap.org/data/2.5/onecall?lat=0.0&lon=0.0&exclude=minutely,hourly&units=imperial&appid=YOUR_API_KEY';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) {}

  getCurrentWeather(): Observable<any> {
    return this.http.get(OPEN_WEATHER_URL);
  }
}
```

### [Android Development](https://ionicframework.com/docs/developing/android)

There are quite a few steps to get the app up and running in the Android device. But at the end, it boils down to
```
ionic cap run android
```
assuming that you already familar with Android development and have Android Studio and Virtual Device already installed.

The app showed up. However, the weather data is not coming through. Just what is happening here. I throught it is
develop-once-run-everywhere!

### [RxJS Error Handling](https://blog.angular-university.io/rxjs-error-handling/)

This prompts me to add some error handling in the service with catchError and throwError.
```js
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class WeatherService {

  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server error');
  }

  getCurrentWeather(): Observable<any> {
    return this.http.get(OPEN_WEATHER_URL)
      .pipe(
        catchError(this.errorHandler)
      )
  }
```
Then the component can catch the error and present a toast with the error message. Unforunately,
the error message is a useless 'http failure response' unknown error. Not much details there.
```js
import { ToastController } from '@ionic/angular';

export class WeatherComponent implements OnInit {

  constructor(private weatherService: WeatherService, private toastController: ToastController) {}

  ngOnInit() {
    this.weatherService.getCurrentWeather().subscribe(
      (data) => {
        ...
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: error,
          duration: 3000,
        });
        toast.present();
      }
    );
  }
```

### [Debugging Android Apps](https://ionicframework.com/docs/developing/android#debugging-android-apps)

Okay, time to find out how to debug into the Android app. Given that the console.log() does not show in Android logcat,
it would be difficult to track down the problem without it.

Ionic website is quite helpful and the [Chrome DevTools](chrome://inspect/#devices) can provide the Javascript console
from the simulator or physical device. ERR_CLEARTEXT_NOT_PERMITTED shows up in the console log which indicates Android
security is in play here.

[ERR_CLEARTEXT_NOT_PERMITTED in debug app on Android](https://forum.ionicframework.com/t/err-cleartext-not-permitted-in-debug-app-on-android/164101/20)
solved my problem with the usesCleartextTraffic attribute in the AndroidManifest.xml.

```
<application
    ...
    android:usesCleartextTraffic="true"
    android:theme="@style/AppTheme">
```
Okay, first component finally done.
