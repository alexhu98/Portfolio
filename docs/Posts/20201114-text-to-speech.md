# Text-to-Speech
##### November 14th, 2020 By Alex Hu

The [Text-to-Speech Plugin](https://ionicframework.com/docs/native/text-to-speech/)
provides an easy way to read the note out loud. Not an essential feature, but it is another plugin that I can try out.
Installing and using the plugin is quite straight forward, you just need to put the TextToSpeech in the
AppModule as a provider, and call speak() to start, and then speak('') to stop.

```js
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

export class NoteModalPage {
  @Input() id: string;
  @Input() content: string;

  constructor(
    ...
    private tts: TextToSpeech,
  ) { }

  speak(): void {
    if (this.isAndroid()) {
      this.tts.speak(this.content);
    }
  }
```

### [Modal](https://ionicframework.com/docs/api/modal)

The speak button is hosted in a modal page that also allow me to edit the note.

```
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button (click)="cancel()">
        <ion-icon name="arrow-back"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-buttons slot="end">
      <ion-button (click)="save()">Save</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content padding>
  <ion-fab vertical="bottom" horizontal="center" slot="fixed">
    <ion-fab-button color="light" (click)="speak()">
      <ion-icon name="mic"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  <ion-textarea autoGrow autoFocus [(ngModel)]="content"></ion-textarea>
</ion-content>
```

The current speech is stopped by tts.speak('') in ngOnDestory(), when the modal is
dismissed by the Save button, the Back arrow in the toolbar or Android's Back button.

```js
import { Component, Input, OnDestroy } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { isPlatform, ModalController } from '@ionic/angular';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-note-modal',
  templateUrl: './note-modal.page.html',
  styleUrls: ['./note-modal.page.scss'],
})
export class NoteModalPage implements OnDestroy {
  @Input() id: string;
  @Input() content: string;

  constructor(
    private modalController: ModalController,
    private noteService: NoteService,
    private tts: TextToSpeech,
  ) { }

  ngOnDestroy() {
    if (this.isAndroid()) {
      this.tts.speak('');
    }
  }

  async cancel(): Promise<void> {
    this.modalController.dismiss();
  }

  async save(): Promise<void> {
    if (this.id || this.content) { // don't save a new empty note
      await this.noteService.update(this.id, this.content)
    }
    this.modalController.dismiss();
  }

  speak(): void {
    if (this.isAndroid()) {
      this.tts.speak(this.content).then();
    }
  }

  isAndroid(): boolean {
    return isPlatform('capacitor');
  }
}
```

Bringing up the modal page is trigger by tapping the note in the list.

```
<ion-card>
  <ion-list>
    <ion-item *ngFor="let note of (notes$ | async)">
      <h5 (click)="edit(note.id, note.content)">{{ firstLine(note.content) }}</h5>
      <ion-button color="light" slot="end" (click)="remove(note.id)">
        <ion-icon name="trash"></ion-icon>
      </ion-button>
    </ion-item>
  </ion-list>
</ion-card>
```

```js
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'
import { NoteModalPage } from '../note-modal/note-modal.page'
import { NoteService } from '../services/note.service'

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent {

  notes$ = this.noteService.notes$;

  constructor(
    private modalController: ModalController,
    private noteService: NoteService,
  ) {}

  firstLine(content: string): string {
    return content.trim().split('\n')[0];
  }

  async edit(id: string, content: string): Promise<void> {
    const note = { id, content };
    const modal = await this.modalController.create({
      component: NoteModalPage,
      componentProps: note,
    });
    modal.present();
  }

  async remove(id: string): Promise<void> {
    await this.noteService.remove(id);
  }
}
```
