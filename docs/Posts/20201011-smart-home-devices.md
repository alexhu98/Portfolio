# Smart Home Devices
##### Octember 11th, 2020 By Alex Hu

I have a fan and a light switch controlled by TP-Link smart switch in my office. My son and I installed them
so that we don't have to reach over to turn them on and off :-) Now we just say the words and Google Assistent
will obey my command, until it does not. Once in a while, Goolge Assistent just don't want to listen to me and
I find myself looking for the Kasa app on my phone to execute the command. So I want to see if I can integrate
the TP-Link smart switches into my personal mobile app.

### [TP-Link Cloud API](https://www.npmjs.com/package/tplink-cloud-api)

The tplink-cloud-api NPM module allows your to remotely control your TP-Link smartplugs, smart switches,
and smartbulbs using the TP-Link cloud web service, from anywhere, without the need to be on the same wifi/lan.

A [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject) is used to store the list of devices.
When the device component becomes visible, the service is contructed with a periodic timer to update
```js
export class DeviceService implements OnDestroy {

  devices$ = new BehaviorSubject<any>([]);

  private minuteInterval: any;
  private tplink: any;

  constructor(private http: HttpClient) {
    this.updateDevices().then();
    this.minuteInterval = setInterval(() => {
      this.updateDevices().then();
    }, ONE_MINUTE);
  }

  ngOnDestroy(): void {
    if (this.minuteInterval) {
      clearInterval(this.minuteInterval);
    }
  }

  async connect() {
    if (!this.tplink) {
      this.tplink = await login(TPLINK_USER, TPLINK_PASSWORD);
    }
  }

  async updateDevices() {
    await this.connect();
    if (this.tplink) {
      const deviceList = await this.tplink.getDeviceList();
      ...
      this.devices$.next(deviceList;
    }
  }
```

### Naming Convention for Observable

I am seeing a lot of $ in examples, which simply indicates that variable$ is an observable.
```js
export class DeviceComponent {

  devices$ = this.deviceService.devices$;

  constructor(private deviceService: DeviceService) {}
}
```

### async Pipe
Subscription is also simplified with the async pipe in the template which will unsubscribe automatically,
eliminated the needs for OnInit and OnDestroy. Now the component is much smaller.
```
<ion-item *ngFor="let device of (devices$ | async)">
  <ion-icon name="{{ device.icon }}" size="large"></ion-icon>
  <h5>{{ device.alias }}</h5>
</ion-item>
```

### Data Update Revisited

After watching [Complex features made easy with RxJS](https://youtu.be/B-nFj2o03i8?t=876), I want to try
the refresh$ pipe approach. For example, the following code just look a bit odd, calling an async function
in the constructor, therefore the Promise.then() was called to trigger the function.
```js
constructor(private http: HttpClient) {
  this.updateDevices().then();
  this.minuteInterval = setInterval(() => {
    this.updateDevices().then();
  }, ONE_MINUTE);
}
```
The code I ended up looks more cryptic but I guess it is actually a common pattern in RxJS.
The refresh$ below is a a manual trigger while refreshTimer$ will periodically trigger the
refresh. The devices$ will get the devices from the async updateDevices() function.
```js
export class DeviceService implements OnDestroy {

  refresh$ = new BehaviorSubject<any>(null);
  refreshTimer$ = timer(0, ONE_MINUTE);

  devices$ = this.refresh$.pipe(
    exhaustMap(() => from(this.updateDevices())),
  )

  private subs = new SubSink();
  private tplink: any;

  constructor(private http: HttpClient) {
    this.subs.add(this.refreshTimer$.subscribe(this.refresh$));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  async connect() {
    if (!this.tplink) {
      this.tplink = await login(TPLINK_USER, TPLINK_PASSWORD);
    }
  }

  async updateDevices() {
    await this.connect();
    if (this.tplink) {
      const deviceList = await this.tplink.getDeviceList();
      ...
      return deviceList;
    }
    return [];
  }
```
The component UI has a button to toggle the device on and off, and will refresh the UI by calling
a refresh$.next().
```js
  async toggleDevice(name: string) {
    await this.connect();
    if (this.tplink) {
      await this.tplink.getHS100(name).toggle();
      this.refresh$.next(null);
    }
  }
}
```
In the case of the calendar service, the updateEvent$ is used instead of from(Promise),
just like the tutorial video.
```js
export class CalendarService implements OnDestroy {

  refresh$ = new BehaviorSubject<any>(null);
  refreshTimer$ = timer(0, ONE_MINUTE);

  updateEvents$ = this.http.get(CALENDAR_URL).pipe(
    map(mapEvents),
    catchError(handleError)
  )

  events$ = this.refresh$.pipe(
    exhaustMap(() => this.updateEvents$),
  )

  private subs = new SubSink();

  constructor(private http: HttpClient) {
    this.subs.add(this.refreshTimer$.subscribe(this.refresh$));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
```
With this pattern, all setInterval() are replaced by the refresh$ and refreshTimer$.
