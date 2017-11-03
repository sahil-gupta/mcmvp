import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../pages';

import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  doFirebaseLogin() {
    // firebase.auth().signOut();

    firebase.auth().signInWithEmailAndPassword(this.account.email, this.account.password)
    .then(success => {
      console.log('user logged in');
      this.navCtrl.push(MainPage);
    })
    .catch(err => {
      // error.code
      let toast = this.toastCtrl.create({
        message: err.message,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    });
  }
}
