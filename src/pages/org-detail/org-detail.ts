import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-org-detail',
  templateUrl: 'org-detail.html'
})
export class OrgDetailPage {
  orgDisplay: any;

  constructor(public navCtrl: NavController,
    navParams: NavParams,
    private iab: InAppBrowser) {
    this.orgDisplay = navParams.get('orgDisplay');
  }

  openWebsite(website) {
    // const browser =
    this.iab.create(website, '_blank', 'location=no');
  }
}
