import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';

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
    private iab: InAppBrowser) {
    this.blockorgs = navParams.get('blockorgs') || [];
    // console.log(this.blockorgs)
    this.theuser = navParams.get('theuser') || {};
    this.choiceName = 'nameFirst'; // the key on 'theuser'

    this.theamounts = [20, 10, 5];
    this.choiceAmount = 1; // the index on 'theamounts'

    this.thepayments = ['Paypal', 'Venmo', 'Bitcoin'];
    this.choicePayment = 1; // the index on 'thepayments'
  }

  openWebsite(website) {
    // const browser =
    this.iab.create(website, '_blank', 'location=no');
  }

  addBlockNow() {
    console.log('show venmo, paypal, coinbase')
    console.log(this.choiceName + this.choiceAmount + this.choicePayment)
  }

  calcSum() {
    var sum = 0;
    for (var i in this.blockorgs) {
      sum += this.blockorgs[i].percentage;
    }
    return sum;
  }
}
