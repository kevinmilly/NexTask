import { Component, ViewChild } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MediaChange, MediaObserver } from '@angular/flex-layout'

import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  media$: Observable<MediaChange[]>;

  mediaSub:Subscription;

  hide:boolean;
  sizes = ['md','lg','xl'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    media:MediaObserver
  ) {
    this.initializeApp();
    this.lock();
    this.media$ = media.asObservable();
    this.mediaSub = this.media$.subscribe(media => {
      console.log(media[0].mqAlias);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
        }, false);
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    })
  }

  async lock() {
    await screen.orientation.lock("portrait");
  }
}
