import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, ToastController } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';

import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

import * as firebase from 'firebase/app';

import { AngularFireAuth } from 'angularfire2/auth';

// import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  // orgs: Observable<any[]>; // heree
  afDBlocal: AngularFireDatabase;
  orgobservable;
  lastOrg;
  realorgs;
  thesegment;
  currentUser;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    afDB: AngularFireDatabase,
    public toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private youtube: YoutubeVideoPlayer) {
      this.afDBlocal = afDB;
      this.thesegment = 'curated';
      afAuth.authState.subscribe((user: firebase.User) => {
        if (!user) {
          console.log('no user');
          if (this.orgobservable) {
            this.orgobservable.unsubscribe(); // need to unsubscribe to avoid errors
          }
          this.currentUser = null;
          return;
        }
        this.currentUser = user;
      });

      // same code in segmentChanged for 'curated'
      this.orgobservable = this.afDBlocal.list('orgs', ref => {
        return ref.orderByChild('MCstars').limitToLast(7);
      }).valueChanges()
      .subscribe(res => {
        this.realorgs = res.reverse();
      });

  }

  segmentChanged(ev) {
    if (ev._value === 'all') {
      this.realorgs = [];

      this.orgobservable = this.afDBlocal.list('orgs', ref => {
        return ref.orderByChild('PPnameSearch').limitToFirst(15);
      }).valueChanges()
      .subscribe(res => {
        this.lastOrg = res[res.length - 1];
        this.realorgs = res;
        console.log(res) // heree
      });

    } else if (ev._value === 'curated') {
      this.realorgs = [];

      this.orgobservable = this.afDBlocal.list('orgs', ref => {
        return ref.orderByChild('MCstars').limitToLast(7);
      }).valueChanges()
      .subscribe(res => {
        this.realorgs = res.reverse();
      });
    } else if (ev._value === 'my') {
      this.realorgs = [];

      // this.orgobservable = this.afDBlocal.list('users/' + this.currentUser.uid + '/orgs').snapshotChanges()
      // .subscribe(res => {
      //   console.log(res)
      //   for (var i in res) {
      //     console.log(res[i].payload.key + '...' + res[i].payload.val())
      //   }
          // sort them by name
        // set realorgs
      // });
      firebase.database().ref('users/' + this.currentUser.uid + '/orgs').
        on('value', snapshot => {
          console.log(snapshot);
          console.log(snapshot.val())
        })

      // if length is zero
      // let toast = this.toastCtrl.create({
      //   message: 'Check out Curated to build your portfolio',
      //   duration: 3000,
      //   position: 'middle'
      // });
      // toast.present();
    }
  }

  toggleChanged(ev) {
    // console.log(this.realorgs)
    // for (var i in this.realorgs) {
    //   if (this.realorgs[i].checked) {
    //     console.log(this.realorgs[i].PPname)
    //   }
    // }
    console.log(ev);
    console.log(this.currentUser);
    // .checked .uid
    // firebase.database().ref('users/' + this.currentUser.uid + '/orgs/' + ev.checked)


  }

  doInfinite(): Promise<any> {
    console.log('begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {
        this.orgobservable = this.afDBlocal.list('orgs', ref => {
          return ref.orderByChild('PPnameSearch').startAt(this.lastOrg.PPnameSearch).limitToFirst(15);
        }).valueChanges()
        .subscribe(res => {
          this.lastOrg = res[res.length - 1];
          res.shift(); // remove first one which is a duplicate
          this.realorgs.push.apply(this.realorgs, res);
        })

        console.log('end async operation');
        resolve();
      }, 50);
    });
  }

  ionViewDidLoad() {
  }

  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      return;
    }

    this.orgobservable = this.afDBlocal.list('orgs', ref => {
      return ref.orderByChild('PPnameSearch')
                .startAt(val.toLowerCase())
                .endAt(val.toLowerCase() + "\uf8ff")
                .limitToFirst(30);
    }).valueChanges()
    .subscribe(res => {
      this.realorgs = res;
    });
  }

  resetItems(ev) {
    this.orgobservable.unsubscribe();
    this.lastOrg = {'PPnameSearch': ''}; // reset
    this.realorgs = [];
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  // addItem() {
  //   let addModal = this.modalCtrl.create('ItemCreatePage');
  //   addModal.onDidDismiss(item => {
  //     if (item) {
  //       this.items.add(item);
  //     }
  //   })
  //   addModal.present();
  // }

  /**
   * Delete an item from the list of items.
   */
  // deleteItem(item) {
  //   this.items.delete(item);
  // }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item) {
    // this.navCtrl.push('ItemDetailPage', {
    //   item: item
    // });
    this.youtube.openVideo('dQw4w9WgXcQ')

  }
}
