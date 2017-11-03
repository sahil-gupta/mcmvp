import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../pages';

import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { first_name: string, last_name: string, email: string, password: string } = {
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doFirebaseSignup() {
    // firebase.auth().signOut()

    firebase.auth().createUserWithEmailAndPassword(this.account.email, this.account.password)
    .then(success => {
      var uid = success.uid;
      console.log('new user ' + uid);

      // this is the auth database, not the /users database
      success.updateProfile({
        displayName: this.account.first_name + ' ' + this.account.last_name
        // ,photoURL: "urlhere"
      }).then(function() {
        // profile updated
      }, function(error) {
        // error
      });

      // add the init video to inbox
      firebase.database().ref('usersvideos/' + uid).set({
        0: 100
      });

      // assign latest mNumber
      firebase.database().ref('globals/mNumberLatest').once('value', snapshot => {
        var mNumber = snapshot.val();
        firebase.database().ref('globals/mNumberLatest').set(mNumber+1);

        firebase.database().ref('users/' + uid).set({
          last_name: this.account.last_name,
          first_name: this.account.first_name,
          mNumber: mNumber
        });
      });

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

  tologin() {
    this.navCtrl.push('LoginPage');
  }
}
