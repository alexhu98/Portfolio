# Swipe Gesture
##### Octember 13th, 2020 By Alex Hu

The mobile app uses the tabs interface to switch between the calendar tab and the device tab.
In additional to tapping the tab button, I found myself trying to swipe between tabs but it is
not a default action provided by the framework.

### [Gestures](https://ionicframework.com/docs/utilities/gestures)

After reading up on the topic and a few iterations, I finally settle down on a base page component class.
It makes use of the ngAfterViewInit() lifecycle hook to create the gesture. At the end of the pan gesture,
the velocity of the x-axis and y-axis are compared and check for some minimal requirements to determine
if it is a left or right swipe and navigate to the tab accordingly.

```js
import { AfterViewInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { GestureController } from '@ionic/angular'

export class SwipeTabPage implements AfterViewInit {

  @ViewChild('swipeTabPage') swipeTabPage: ElementRef;

  private panStartX = 0;

  constructor(
    protected router: Router,
    protected zone: NgZone,
    protected gestureController: GestureController,
    protected swipeLeftUrl: string,
    protected swipeRightUrl: string,
  ) {}

  ngAfterViewInit(): void {
    this.createGesture();
  }

  createGesture(): void {
    if (this.swipeTabPage?.nativeElement) {
      const gesture = this.gestureController.create({
        gestureName: 'swipe-tab',
        gesturePriority: 100,
        el: this.swipeTabPage.nativeElement,
        direction: 'x',
        onStart: (ev) => this.onStart(ev),
        onEnd: (ev) => this.onEnd(ev),
      })
      gesture.enable()
    }
    else {
      console.error(`SwipeTabPage -> createGesture -> swipeTabPage`, this.swipeTabPage)
    }
  }

  private onStart(ev) {
    this.panStartX = ev.currentX;
  }

  private onEnd(ev) {
    if (ev.type === 'pan') {
      const panStartX = this.panStartX;
      const panEndX = ev.currentX;
      if (Math.abs(ev.velocityX) > 0.10 && Math.abs(ev.velocityX) > Math.abs(ev.velocityY) * 2) {
        if (panStartX > panEndX) {
          this.onSwipeLeft();
        }
        else {
          this.onSwipeRight();
        }
      }
    }
  }

  protected onSwipeLeft(): void {
    this.zone.run(async () => {
      await this.router.navigate([this.swipeLeftUrl]);
    });
  }

  protected onSwipeRight(): void {
    this.zone.run(async () => {
      await this.router.navigate([this.swipeRightUrl]);
    });
  }
}
```

The child tab page component simply provides all the necessary controllers to and links
to the base class.

```js
export class Tab2Page extends SwipeTabPage {

  constructor(
    router: Router,
    zone: NgZone,
    gestureController: GestureController,
  ) {
    super(router, zone, gestureController, '/tabs/tab1', '/tabs/tab3');
  }
}
```
In the html template, I have to add a #swipeTabPage block to surround the actual cntent and specify
the minimum height to the 100vh - 130px, where 130px roughly accounts for the header and the bottom tabs panel.
```
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>{{ today$ | async }}</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <div #swipeTabPage class="swipe-tab-page">
    <app-device name="Devices"></app-device>
  </div>
</ion-content>
```
Without this #swipeTabPage block, the swipe gesture would not take place on blank area below the component content.
```
.swipe-tab-page {
  min-height: calc(100vh - 130px);
}
```
