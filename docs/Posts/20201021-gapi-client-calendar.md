# gapi.client.calendar
##### Octember 21st, 2020 By Alex Hu

In order to retrieve the calendar events from the Google calendar directly into the mobile app,
we need an identifier called the access token from authentication process. The access token
represents my identity and we pass it into the gapi.client library so that Google knows
whose calendar it should retrieve.

Now that the AuthenticationService can handle authentication on the Android environment as
well as the web environment, the calendar logic can be moved from the ExpressJS into
the mobile app. Although it is possible to access the calendar using the REST api,
I very much preferred to make use of the official Google gapi.client.calendar library.

The challenge is to make the gapi.client library available for both the Android environment
and the web environment. The traditional way to include the API script like the following just
does not work in the Android environment.
```js
<script src="https://apis.google.com/js/api.js"></script>
```
After some searching, the ng-gapi module come to the rescue.

### [ng-gapi](https://www.npmjs.com/package/ng-gapi)

The ng-gapi module add the Google api to the project. It wraps the Gapi in to a service layer allowing to
work with Gapi in a Angular 9+ project.

More importantly, it works with Ionic very well. There are 2 main services in ng-gapi, namely
GoogleAuthService and GoogleApiService. Although you cannot use GoogleAuthService in the Android environment,
you can use it in the web app without problem as I do so in my AuthenticationService.

Installing the ng-gapi is easy, and we will get to the GoogleApiService in the next section.
```
npm install ng-gapi
```

### [GoogleApiService](https://github.com/google/google-api-javascript-client)

Looking into the GoogleApiService source code, it is a thin layer to load the Google gapi library
dynamically at run-time. Once the GoogleApiService.onLoad() succeed, the gapi variable becomes available,
and the gapi.client can be loaded. The gapi.client.calendar is eventually loaded and stored in the
calendarApi variable.

```js
private calendarApi: any;

constructor(private gapiService: GoogleApiService) {
  this.gapiService.onLoad().subscribe(() => this.loadGapiClient());
}

loadGapiClient() {
  gapi.load('client', async () => {
    await gapi.client.load('calendar', 'v3');
    this.calendarApi = (gapi.client as any).calendar;
    ...
  });
}
```

The fetchEvents() function simply checks the calendarApi before accessing the gapi.client.calendar.events.list
api. The gapi.client.calendar also requires the user's access token from the AuthenticationService so that
the correct calendar can be retrieved.

```js
fetchEvents() {
  const accessToken = this.authenticationService.getAccessToken();
  if (accessToken && this.calendarApi) {
    gapi.client.setToken({
      access_token: accessToken,
    });
    const eventStartTime = formatISO(startOfToday())
    const eventEndTime = formatISO(addWeeks(startOfToday(), 2))
    const request = this.calendarApi.events.list({
      calendarId: 'primary',
      singleEvents: true,
      timeMin: eventStartTime,
      timeMax: eventEndTime,
      orderBy: 'startTime',
    });
    request.execute(response => {
      if (!response.error) {
        const events = R.map((item: any) => ({
          id: item.id,
          summary: item.summary,
          start: item.start.date || item.start.dateTime,
          end: item.end.date || item.end.dateTime,
        }), R.defaultTo([], response.items))
        const mappedEvents = mapEvents(events)
        this.ngZone.run(() => {
          this.events$.next(mappedEvents)
        });
      }
      else {
        console.error(`CalendarService -> fetchEvents -> error -> response`, response);
      }
    });
  }
  else {
    this.ngZone.run(() => {
      this.events$.next([])
    });
  }
}
```

### [NgZone](https://dzone.com/articles/understanding-ngzone)

There were a few seconds of delay between the event is emitted and the UI was updated. After a quick search,
it happens that I need to wrap it inside a NgZone and the changes are then reflected in the UI immediately.

```js
this.ngZone.run(() => {
  this.events$.next(mappedEvents)
});
```

### Calendar Service

Putting it all together, here is the full code of the CalendarService. The first part of the code is just
mapping the calendar events into the format that I want to show on the user interface, and then set up the
logic to handle automatic refresh and manual refresh.

The magic is in the loadGapiClient() function. Once we have access to gapi.client.calendar, the rest is history.

```js
import * as R from 'ramda';
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { addWeeks, differenceInDays, format, formatISO, isToday, parseISO, startOfToday, subDays } from 'date-fns'
import { GoogleApiService } from 'ng-gapi'
import { SubSink } from 'subsink'
import { AuthenticationService } from './authentication.service'

const ONE_SECOND = 1000;
const TEN_SECOND = 10 * 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;

const getIconName = (summary): string => {
  let iconName = '';
  if (summary.includes('Pay Day')) {
    iconName = 'cash-outline';
  }
  if (summary.includes('Vacation')) {
    iconName = 'rocket-outline';
  }
  return iconName;
}

const getDayName = (isoDateTime: string): string => {
  const date = parseISO(isoDateTime);
  return (isToday(date) ? 'Today' : format(date, 'LLL d')) + format(date, ' EEE');
}

const getTime = (isoDateTime: string): string => {
  return isoDateTime.includes('T') ? format(parseISO(isoDateTime), 'p').toLocaleLowerCase() : '';
}

const getEndDay = (start: string, end: string): string => {
  if (getTime(start)) {
    return '';
  }
  else {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    const diff = differenceInDays(endDate, startDate);
    if (diff > 1) {
      return '- ' + getDayName(formatISO(subDays(endDate, 1)));
    }
  }
  return '';
}

const mapEvent = (event: any) => ({
  ...event,
  iconName: getIconName(event.summary),
  day: getDayName(event.start),
  time: getTime(event.start),
  endDay: getEndDay(event.start, event.end),
})

const mapEvents = (events: any) => {
  return events.map(mapEvent)
}

const formatToday = (): string => {
  const date = new Date();
  return format(date, 'LLL d EEE') + ' ' + format(date, 'p').toLocaleLowerCase();
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService implements OnDestroy {

  refreshTimer$ = timer(0, ONE_HOUR);
  refresh$ = new BehaviorSubject<any>(null);
  events$ = new BehaviorSubject<any>([]);

  today$ = timer(0, TEN_SECOND).pipe(
    map(() => formatToday()),
    distinctUntilChanged(),
  );

  private subs = new SubSink();
  private calendarApi: any;

  constructor(
    private ngZone: NgZone,
    private gapiService: GoogleApiService,
    private authenticationService: AuthenticationService,
  ) {
    this.subs.add(this.refreshTimer$.subscribe(this.refresh$));
    this.subs.add(this.refresh$.subscribe(() => this.fetchEvents()));
    this.subs.add(this.authenticationService.user$.subscribe(() => this.refresh()));
    this.subs.add(this.gapiService.onLoad().subscribe(() => this.loadGapiClient()));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadGapiClient() {
    gapi.load('client', async () => {
      await gapi.client.load('calendar', 'v3');
      this.calendarApi = (gapi.client as any).calendar;
      this.refresh();
    });
  }

  refresh(): void {
    this.refresh$.next(null);
  }

  fetchEvents() {
    const accessToken = this.authenticationService.getAccessToken();
    if (accessToken && this.calendarApi) {
      gapi.client.setToken({
        access_token: accessToken,
      });
      const eventStartTime = formatISO(startOfToday())
      const eventEndTime = formatISO(addWeeks(startOfToday(), 2))
      const request = this.calendarApi.events.list({
        calendarId: 'primary',
        singleEvents: true,
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        orderBy: 'startTime',
      });
      request.execute(response => {
        if (!response.error) {
          const events = R.map((item: any) => ({
            id: item.id,
            summary: item.summary,
            start: item.start.date || item.start.dateTime,
            end: item.end.date || item.end.dateTime,
          }), R.defaultTo([], response.items))
          const mappedEvents = mapEvents(events)
          this.ngZone.run(() => {
            this.events$.next(mappedEvents)
          });
        }
        else {
          console.error(`CalendarService -> fetchEvents -> error -> response`, response);
        }
      });
    }
    else {
      this.ngZone.run(() => {
        this.events$.next([])
      });
    }
  }
}
```
