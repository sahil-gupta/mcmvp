import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, ToastController } from 'ionic-angular';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  lastOrg;
  realorgs; // added the property "ein" for easy read access
  checkedOrgs;
  thesegment;
  currentUser;
  db;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    afAuth: AngularFireAuth) {
      this.db = firebase.database();
      this.thesegment = 'curated';
      this.realorgs = [];
      this.checkedOrgs = [];
      afAuth.authState.subscribe((user: firebase.User) => {
        this.currentUser = user;
        if (!user) {
          console.log('no user');
          return;
        }
      });

      // load up curated tab
      // similar code in segmentChanged for 'curated'
      this.db.ref('orgs').orderByChild('MCstars').limitToLast(7)
        .once('value', snapshot => {
          var temp = [];
          var tempItem = {};
          snapshot.forEach(function(childSnapshot) {
            tempItem = childSnapshot.val();
            tempItem['ein'] = childSnapshot.key;
            temp.push(tempItem);
          });
          this.realorgs = temp.reverse();

          // get checked orgs from user database
          // is continually synced ('on' vs 'once')
          this.db.ref('users/' + this.currentUser.uid + '/orgs')
            .on('value', snapshot => {
              this.checkedOrgs = snapshot.val() || [];
              this.updateCheckedValues();
            });
        });
  }



  segmentChanged(ev) {
    if (ev._value === 'all') {
      this.realorgs = [];

      this.db.ref('orgs').orderByChild('PPnameSearch').limitToFirst(15)
        .once('value', snapshot => {
          if (this.thesegment !== 'all') return;

          var temp = [];
          var tempItem = {};
          snapshot.forEach(function(childSnapshot) {
            tempItem = childSnapshot.val();
            tempItem['ein'] = childSnapshot.key;
            temp.push(tempItem);
          });
          this.lastOrg = temp[temp.length - 1];
          this.realorgs = temp;

          this.updateCheckedValues();
        });

    } else if (ev._value === 'curated') {
      this.realorgs = [];

      this.db.ref('orgs').orderByChild('MCstars').limitToLast(7)
        .once('value', snapshot => {
          if (this.thesegment !== 'curated') return;

          var temp = [];
          var tempItem = {};
          snapshot.forEach(function(childSnapshot) {
            tempItem = childSnapshot.val();
            tempItem['ein'] = childSnapshot.key;
            temp.push(tempItem);
          });
          this.realorgs = temp.reverse();

          this.updateCheckedValues();
        });

    } else if (ev._value === 'my') {
      this.realorgs = [];

      var temp = this.checkedOrgs;
      var tempkeys = (<any>Object).keys(temp);
      tempkeys = tempkeys.filter(k => temp[k]); // only true values

      if (!tempkeys.length) {
        let toast = this.toastCtrl.create({
          message: 'Check out Curated to build your portfolio',
          duration: 3000,
          position: 'middle',
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        toast.present();
      }

      for (var i in tempkeys) {
        this.db.ref('orgs/' + tempkeys[i])
          .once('value', snapshot => {
            if (this.thesegment !== 'my') return;

            var temp2Item = snapshot.val();
            temp2Item['ein'] = snapshot.key;
            this.realorgs.push(temp2Item);

            this.updateCheckedValues();
          });
      }
    }
  }



  toggleChanged(ev) {
    this.db.ref('users/' + this.currentUser.uid + '/orgs/' + ev.ein)
      .set(ev.checked);
  }



  infiniteScroll(): Promise<any> {
    console.log('begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {
        this.db.ref('orgs').orderByChild('PPnameSearch')
          .startAt(this.lastOrg.PPnameSearch)
          .limitToFirst(15)
          .once('value', snapshot => {
            if (this.thesegment !== 'all') return;

            var temp = [];
            var tempItem = {};
            snapshot.forEach(function(childSnapshot) {
              tempItem = childSnapshot.val();
              tempItem['ein'] = childSnapshot.key;
              temp.push(tempItem);
            });
            this.lastOrg = temp[temp.length - 1];
            temp.shift(); // remove the first item, a duplicate
            this.realorgs.push.apply(this.realorgs, temp);

            this.updateCheckedValues();
          });

        console.log('end async operation');
        resolve();
      }, 50);
    });
  }

  searchForOrgs(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      return;
    }

    this.db.ref('orgs').orderByChild('PPnameSearch')
      .startAt(val.toLowerCase())
      .endAt(val.toLowerCase() + "\uf8ff")
      .limitToFirst(30)
      .once('value', snapshot => {
        if (this.thesegment !== 'all') return;

        var temp = [];
        var tempItem = {};
        snapshot.forEach(function(childSnapshot) {
          tempItem = childSnapshot.val();
          tempItem['ein'] = childSnapshot.key;
          temp.push(tempItem);
        });
        this.realorgs = temp;

        this.updateCheckedValues();
      });
  }

  resetOrgs(ev) {
    this.lastOrg = {'PPnameSearch': ''};
    this.realorgs = [];
  }

  openItem(org) {
    var orgDisplay = {};

    orgDisplay['name'] = org.PPname; // also CNcharityName
    orgDisplay['description'] = org.PPdescription || org.CNdescription;
    orgDisplay['slogan'] = org.CNslogan;
    orgDisplay['website'] = org.CNwebsite || org.PPwebsite;
    orgDisplay['logoUrl'] = org.PPlogoUrl;

    orgDisplay['charityNavUrl'] = org.CNcharityNavUrl;
    orgDisplay['score'] = org.CNscore || null;
    if (org.CNstars >= 1)
      orgDisplay['stars'] = org.CNstars;

    orgDisplay['charityNavSection'] = false;
    if (orgDisplay['charityNavUrl'] || orgDisplay['score'] || orgDisplay['stars'])
      orgDisplay['charityNavSection'] = true;


    orgDisplay['areas'] = [];
    if (org.PPmissionAreas)
      orgDisplay['areas'] = (<any>Object).values(org.PPmissionAreas);
    if (org.CNcause)
      orgDisplay['areas'].push(org.CNcause);
    if (org.CNcategory)
      orgDisplay['areas'].push(org.CNcategory);
    orgDisplay['areas'] = Array.from(new Set(orgDisplay['areas'])); // remove dups

    this.navCtrl.push('ItemDetailPage', {
      orgDisplay: orgDisplay
    });
  }

  updateCheckedValues() {
    if (!this.checkedOrgs)
      return;
    for (var i in this.realorgs)
      this.realorgs[i].checked = this.checkedOrgs[this.realorgs[i]['ein']];
  }
}
