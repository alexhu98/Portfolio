# Google Calendar API
##### Octember 3rd, 2020 By Alex Hu

I would to show a summary of events of the next few days from my calendar and
[Google Calendar API](https://developers.google.com/calendar/overview) has good support
for it.

There are a few ways that you can fetch the data. With my limited knowledge on Angular,
I decided to do the work on the server side using my personal Node.js / Express server.

### [How To Use The Google Calendar API In Node.js](https://www.youtube.com/watch?v=zrLf4KMs71E)

This tutorial has a step by step instruction on how to setup the Google Calendar API and getting
an OAuth token of my own Google account to be included in the personal server. This is not a
general solution for multiple users, but it works for my single account mobile app.

Overall, it took less than 40 lines of code to get the calendar events of the next 2 weeks.
It is filtered down to just the summary and the start and end day.

```js
import { Request, Response } from 'express'
import { google } from 'googleapis'
import { addWeeks, format, startOfToday } from 'date-fns'
import * as R from 'ramda'

const { OAuth2 } = google.auth

const CLIENT_ID = 'YOUR_CLIENT_ID'
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'
const REFRESH_TOKEN = 'YOUR_REFRESH_TOKEN'

const oAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET)
oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
})

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

export const getEvents = async (req: Request, res: Response) => {
  const eventStartTime = format(startOfToday(), 'yyyy-MM-dd') + 'T00:00:00.000Z'
  const eventEndTime = format(addWeeks(startOfToday(), 2), 'yyyy-MM-dd') + 'T00:00:00.000Z'
  const result = await calendar.events.list({
    calendarId: 'primary',
    singleEvents: true,
    timeMin: eventStartTime,
    timeMax: eventEndTime,
    orderBy: 'startTime',
  })
  const events = R.map((item: any) => ({
    id: item.id,
    summary: item.summary,
    start: item.start.date || item.start.dateTime,
    end: item.end.date || item.end.dateTime,
  }), R.defaultTo([], result.data.items))
  res.send(events)
}
```
### [Ramda](https://ramdajs.com/)
By the way, Ramda is like [Lodash](https://lodash.com/). Both are functional programming libraries and this article
explains my preference quite well:
[Functional JavaScript: Why I prefer using Ramda over Lodash or Underscore!](https://www.codementor.io/@michelre/functional-javascript-why-i-prefer-using-ramda-over-lodash-or-underscore-dzovysq11)

### [RxJS Map and Pipe](https://indepth.dev/reading-the-rxjs-6-sources-map-and-pipe/)

On the client side, the component does a simple HTTP GET and do a little mapping to make the data show up nicely
in the component.
```js
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class CalendarService {

  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server error');
  }

  getEvents(): Observable<any> {
    return this.http.get(CALENDAR_URL)
      .pipe(
        map((events: any) => {
          return events.map((event: any) => ({
            ...event,
            iconName: getIconName(event.summary),
            day: getDayName(event.start),
            time: getTime(event.start),
          }))
        }),
        catchError(this.errorHandler)
      );
  }
}
```
