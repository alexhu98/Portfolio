# RxJS Data Update
##### Octember 9th, 2020 By Alex Hu

A good exercise to dive into RxJS is data update. The app has a need to both automatic update
as well as manual update. And there are local update (like the date and time) as well as update
using http request.

### Auto Refresh on Interval

At the top of the app, the current date and time is shown and is refresh every minute
to keep it up to date. A simple 60 seconds interval will do the trick.

```js
const ONE_MINUTE = 60 * 1000;

const formatToday = (): string => {
  const date = new Date();
  return format(date, 'LLL d EEE') + ' ' + format(date, 'p').toLocaleLowerCase();
}

export class CalendarService implements OnDestroy {
  constructor(private http: HttpClient) {}

  private minuteInterval: any;

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.minuteInterval);
    }
  }

  getToday(): Observable<string> {
    return new Observable((subscriber: Subscriber<string>) => {
      subscriber.next(formatToday());
      this.minuteInterval = setInterval(() => {
        subscriber.next(formatToday());
      }, ONE_MINUTE);
    })
  }
```
Later I simplified the above with the [timer](https://rxjs.dev/api/index/function/interval) function that
creates a Observable to emit data every 10 seconds. Here I just [map](https://rxjs.dev/api/operators/map)
(and ignore) the given sequential number into the current time, then apply the
[distinctUntilChanged](https://rxjs.dev/api/operators/distinctUntilChanged) operator to avoid unnecessary UI update.
```js
import { Observable, timer } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

  getToday(): Observable<string> {
    return timer(0, TEN_SECOND).pipe(
      map(() => formatToday()),
      distinctUntilChanged(),
    );
  }
```

### Manual Refresh UI

The [ion-refresher](https://ionicframework.com/docs/api/refresher) provides pull-to-refresh functionality on a content component.
Using the component is easy enough, just place it into your ion-conent and handle the ionRefresh event, and the documentation
provides a good async timeout function to dismiss the refresher after 2 seconds.

The only confusing part is where to put my own content. At first, I try putting the weather and calendar inside the ion-refresher-content
tag but that does not work. It turns that that I just have to put my components in the normal place, and just add the ion-refresher tags
into the ion-content.
```
<ion-content [fullscreen]="true">
  <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  <app-weather name="Weather"></app-weather>
  <app-calendar name="Calendar"></app-calendar>
</ion-content>
```
and my refresh function just call the update functions in the service to trigger an asychronize update. The
refreshed date will come through from the subscription. Note that we are going to change the http.get Observable
into a BehaviorSubject in the next section for this to work as the http.get Observable unsubcribe itself upon
completion of the http request.
```js
doRefresh(event) {
  this.calendarService.updateEvents();
  this.weatherService.updateCurrentWeather();
  event.target.complete();
}
```

### HttpClient Data Update

Performing the actual data refresh is not as simple. There is quite
[a few articles](https://stackoverflow.com/questions/44947551/angular2-4-refresh-data-realtime)
on this subject. So I finally get it after experimenting with RxJS more.

The weather service code started like this:
```js
@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) {}

  getCurrentWeather(): Observable<any> {
    return this.http.get(OPEN_WEATHER_URL)
      .pipe(
        retry(3),
        map(mapData),
        catchError(handleError)
      )
  }
}
```
A [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject), with initial value of an empty array,
is added as a middle man between the http request and the UI component. When getCurrentWeather() is called,
it triggers a call to updateCurrentWeather() for the initial data fetch, then return the weatherSubject as
the Obserable for the component.

An automatic update is also triggered on a hourly interval so always keep the information update to date.

Note that I have to forgo forwarding the error to the BehaviorSubject as the error event is considered completion
as well and the component will no longer receive data update even if http get succeeds on further request.
In my case, the app will keep showing the last received weather data or calendar events.
```js
@Injectable({
  providedIn: 'root'
})
export class WeatherService implements OnDestroy {

  constructor(private http: HttpClient) {}

  private hourInterval: any;
  private weatherSubject = new BehaviorSubject<any>([]);

  ngOnDestroy(): void {
    if (this.hourInterval) {
      clearInterval(this.hourInterval);
    }
  }

  getCurrentWeather(): Observable<any> {
    this.updateCurrentWeather()
    this.hourInterval = setInterval(() => {
      this.updateCurrentWeather()
    }, ONE_HOUR);
    return this.weatherSubject;
  }

  updateCurrentWeather(): void {
    this.http.get(OPEN_WEATHER_URL)
      .pipe(
        retry(3),
        map(mapData),
        catchError(handleError)
      )
      .subscribe(
        data => this.weatherSubject.next(data)
      );
  }
}
```
The weather component below calls getCurrentWeather() just as before, unaware of the implementation change,
except that when new data come through, the UI will automatically display the new data.
```js
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {

  public weatherData = [];

  constructor(private weatherService: WeatherService, private toastController: ToastController) {}

  ngOnInit() {
    this.weatherService.getCurrentWeather().subscribe(
      data => this.weatherData = data,
      error => showToastOnError(this.toastController, error),
    );
  }
}
```
