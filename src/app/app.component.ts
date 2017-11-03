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

        <ion-item *ngIf="currentUser" class="paddingTop">
          <ion-avatar item-left *ngIf="currentUser.photoURL">
            <img [src]="currentUser.photoURL">
          </ion-avatar>
          <h1 *ngIf="currentUser.first_name">{{ currentUser.first_name }}</h1>
        </ion-item>

        <button menuClose ion-item detail-none icon-start (click)="openWebsite()">
          <ion-icon name="text" class="smaller0"></ion-icon>
          Message the Founders
        </button>

        <button menuClose ion-item detail-none icon-start (click)="logout()">
          <ion-icon name="exit" class="smaller0"></ion-icon>
          Logout
        </button>

        <ion-list-header class="topCushion">
            Experimental
        </ion-list-header>
        <button menuClose ion-item icon-start (click)="openPage(blockchainPage)">
          <ion-icon name="logo-buffer" class="smaller0"></ion-icon>
          Blockchain
        </button>
      </ion-list>
    </ion-content>
  </ion-menu>

  <ion-nav #content [root]="rootPage"></ion-nav>
`
})
export class MyApp {
  rootPage = FirstRunPage;
  currentUser;
  blockchainPage;

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

    this.blockchainPage = 'CardsPage';

    this.currentUser = {};
    afAuth.authState.subscribe((user: firebase.User) => {
      if (!user) return;
      var uid = user.uid;
      firebase.database().ref('users/' + uid).once('value', snapshot => {
        this.currentUser = snapshot.val(); // the user from the firebase db, not the firebase auth
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

  openPage(thepage) {
    this.nav.push(thepage);
  }

  openWebsite() {
    // const browser =
    var messenger = 'https://m.me/microchange.io';
    this.iab.create(messenger, '_system', 'location=no');
  }


  logout() {
    firebase.auth().signOut(); // heree need to use .off() to turn off firebase connections first
    console.log('logged out rn')
    this.nav.setRoot('WelcomePage');
  }
}
