import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';

import { FirstRunPage } from '../pages/pages';
import { Settings } from '../providers/providers';

import * as firebase from 'firebase/app';

import { AngularFireAuth } from 'angularfire2/auth';

import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  template:
  `<ion-menu [content]="content">
    <ion-content>
      <ion-list>
        <ion-item *ngIf="currentUser">
          <ion-avatar item-left *ngIf="currentUser.photoURL">
            <img [src]="currentUser.photoURL">
          </ion-avatar>
          <h1 *ngIf="currentUser.first_name">{{ currentUser.first_name }}</h1>
          <h1 item-right *ngIf="currentUser.mNumber" class="italic">== {{ currentUser.mNumber }}</h1>
        </ion-item>
        <button menuClose ion-item (click)="openWebsite()">Message Us</button>
        <button menuClose ion-item (click)="logout()">Logout</button>
      </ion-list>
    </ion-content>
  </ion-menu>

  <ion-nav #content [root]="rootPage"></ion-nav>
`
})
export class MyApp {
  rootPage = FirstRunPage;
  currentUser;

  @ViewChild(Nav) nav: Nav;

  constructor(private translate: TranslateService, platform: Platform, settings: Settings,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    afAuth: AngularFireAuth,
    private iab: InAppBrowser) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();
    this.currentUser = {};
    afAuth.authState.subscribe((user: firebase.User) => {
      if (!user) return;
      var uid = user.uid;
      firebase.database().ref('users/' + uid).once('value', snapshot => {
        this.currentUser = snapshot.val();
        console.log(this.currentUser);
      });
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  openWebsite() {
    // const browser =
    var messenger = 'https://m.me/microchange.io';
    this.iab.create(messenger, '_blank', 'location=no');
  }


  logout() {
    // firebase.auth().signOut(); // heree need to use .off() to turn off firebase connections first
    this.nav.setRoot('WelcomePage');
  }
}
