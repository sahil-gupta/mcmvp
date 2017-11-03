import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import { MainPage } from '../pages';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  // userProfile: any = null;

  constructor(public navCtrl: NavController,
              private afAuth: AngularFireAuth,
              private fb: Facebook,
              private platform: Platform,
              public toastCtrl: ToastController) {
    // afAuth.authState.subscribe((user: firebase.User) => {
    //   if (!user) {
    //     this.userProfile = null;
    //     return;
    //   }
    //   this.userProfile = user;
    // });
  }

  // guide https://github.com/angular/angularfire2/blob/master/docs/ionic/v3.md
  signInWithFacebook() {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile'])
      .then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential)
        .then(success => this.facebookSuccessTodo(success))
        .catch(error => {
          // 'auth/account-exists-with-different-credential'
          console.log(JSON.stringify(error));

          // let toast = this.toastCtrl.create({
          //   message: 'So... this email exists with another account',
          //   duration: 3000,
          // });
          // toast.present();
        });
      })
      .catch(error => {
        console.log('cancelled fb login');
        console.log(JSON.stringify(error));
      });
    } else {
      return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(success => this.facebookSuccessTodo(success))
      .catch(error => {
        // 'auth/account-exists-with-different-credential'
        console.log(JSON.stringify(error));

        // let toast = this.toastCtrl.create({
        //   message: 'So... this email exists with another account',
        //   duration: 3000,
        // });
        // toast.present();
      });
    }
  }

  facebookSuccessTodo(success) {
    console.log("facebook success") // + JSON.stringify(success));
    // console.log(JSON.stringify(success));
    var uid;

    if (success.user)
      uid = success.user.uid;
    else
      uid = success.uid;

    firebase.database().ref('users/' + uid).once('value', snapshot => {
      if (snapshot.val()) { // existing user
        console.log('repeat login');
        this.navCtrl.push(MainPage);
      } else { // new user
        // add the init video to inbox
        firebase.database().ref('usersvideos/' + uid).set({
          0: 100
        });

        // manage mNumber data and additional info
        firebase.database().ref('globals/mNumberLatest').once('value', snapshot => {
          var mNumber = snapshot.val();
          firebase.database().ref('globals/mNumberLatest').set(mNumber+1);

          var p = success.additionalUserInfo.profile;
          firebase.database().ref('users/' + uid).update({
            gender: p.gender,
            timezone: p.timezone,
            link: p.link,
            last_name: p.last_name,
            first_name: p.first_name,
            photoURL: success.user.photoURL,
            mNumber: mNumber
          });

          this.navCtrl.push(MainPage);
        });
      }
    });
  }

  tosignup() {
    this.navCtrl.push('SignupPage');
  }

  quickload() {
    this.navCtrl.push(MainPage);
  }
}
