import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  blocks;

  constructor(public navCtrl: NavController) {
    firebase.database().ref('blocks').orderByKey().on('value', snapshot => {
      var tempblocks = [];
      snapshot.forEach(childSnapshot => {
        var temp = childSnapshot.val();

        // add property
        temp.dateprint = (new Date(temp.timestamp)).toString();

        // add property
        // temp.data = temp.data;

        tempblocks.push(temp);
        return false;
      });
      this.blocks = tempblocks.reverse();

      // data: thedatastringWithName,
      // hash: 'hashSHA256goeshere',
      // previousHash: 'hashSHA256goeshere',
      // index: (lastblock+1),
      // timestamp: d.getTime()

    });
  }
}
