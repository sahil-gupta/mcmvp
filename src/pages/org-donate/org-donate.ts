import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AlertController } from 'ionic-angular';

import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-org-donate',
  templateUrl: 'org-donate.html'
})
export class OrgDonatePage {
  blockorgs = [];
  theuser;
  choiceName;

  theamounts;
  choiceAmount;

  thepayments;
  choicePayment;

  constructor(public navCtrl: NavController,
    navParams: NavParams,
    private iab: InAppBrowser,
    public alertCtrl: AlertController) {
    this.blockorgs = navParams.get('blockorgs') || [];
    // console.log(this.blockorgs)
    this.theuser = navParams.get('theuser') || {};
    this.choiceName = 'nameFirst'; // the key on 'theuser'

    this.theamounts = [20, 10, 5];
    this.choiceAmount = 1; // the index on 'theamounts'

    this.thepayments = ['Paypal', 'Venmo', 'Bitcoin'];
    this.choicePayment = 1; // the index on 'thepayments'. careful that the input turns it to string
  }

  openWebsite(website) {
    // const browser =
    this.iab.create(website, '_blank', 'location=no');
  }

  addBlockNow() {
    var uid = this.theuser['uid'];
    var amount = this.theamounts[this.choiceAmount];
    var payment = parseInt(this.choicePayment);
    var myname = this.theuser[this.choiceName];
    var d = new Date();
    var themonth = this.getMonth(d);

    var thedatastring = '// ' + themonth;

    var orgstring = '';
    var temp1 = this.blockorgs.map(o => o['PPname']);
    var temp2 = this.blockorgs.map(o => o['percentage']);
    if (this.blockorgs.length === 1)
      orgstring = temp1[0];
    else
      orgstring = temp1.join(', ') + ' // ' + temp2.join(', ');

    thedatastring += ' // ' + orgstring;
    var thedatastringWithName = '// ' + myname + ' ' + thedatastring;

    console.log(thedatastring);
    console.log(thedatastringWithName);

    ////////////////

    var url;
    if (payment === 0) {
      url = 'https://www.paypal.me/microchangeIO/'
      this.openWebsite(url + amount);
    } else if (payment === 1) {
      url = 'https://venmo.com/microChange?txn=pay';
      url += '&amount=' + amount;
      url += '&note=' + thedatastring;
      this.openWebsite(url);
    } else if (payment === 2) {
      this.presentAlertWhoops();
      return;
    }

    // back end block management. happens in parallel
    firebase.database().ref('blocks/lastblock').once('value', snapshot => {
      var lastblock = snapshot.val();

      this.presentAlert(lastblock+1);

      // create the new block
      firebase.database().ref('blocks/' + (lastblock+1)).set({
        data: thedatastringWithName,
        hash: 'hashSHA256goeshere',
        previousHash: 'hashSHA256goeshere',
        index: (lastblock+1),
        timestamp: d.getTime()
      });

      // update /lastblock
      firebase.database().ref('blocks/lastblock').set(lastblock+1);

      // add block to usersblocks table
      firebase.database().ref('usersblocks').push({
        uid: uid,
        blockindex: (lastblock+1)
      });
    });
  }

  calcSum() {
    var sum = 0;
    for (var i in this.blockorgs) {
      sum += this.blockorgs[i].percentage;
    }
    return sum;
  }

  presentAlert(n) {
    var height = n+1; // because not zero indexed
    const alert = this.alertCtrl.create({
      title: 'Thanks',
      message: "<p>We got your donation. We're sending it to your charities now.</p><p>microChange is now " + height + " blocks tall :)</p>",
      buttons: [{
          text: 'Got it',
          handler: () => {
            const navTransition = alert.dismiss();
            navTransition.then(() => {
              setTimeout(() => this.navCtrl.pop()); // return to portfolio page
            });
            return false;
          }
        }]
    });

    alert.present();
  }

  presentAlertWhoops() {
    const alert = this.alertCtrl.create({
      title: 'Almost there',
      subTitle: "We're working on bitcoin donations now. We'll keep you posted.",
      buttons: ['Got it']
    });
    alert.present();
  }


  getMonth(date) {
    var month = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    return month[date.getMonth()];
  }

  // simpleHash(s) {
  //   var hash = 0, i, chr;
  //   if (s.length === 0) return hash;
  //   for (i = 0; i < s.length; i++) {
  //     chr   = s.charCodeAt(i);
  //     hash  = ((hash << 5) - hash) + chr;
  //     hash |= 0; // Convert to 32bit integer
  //   }
  //   return hash;
  // }

}
