import { Injectable } from '@angular/core';

import { Item } from '../../models/item';
import { Api } from '../api/api';

@Injectable()
export class Items {
  items: Item[] = [];

  defaultItem: any = {
    "name": "Bob the Builder",
    "profilePic": "assets/img/speakers/cheeta.jpg",
    "about": "Bob is a builder.",
  };


  constructor(public api: Api) {
    let items = [
      {
        "name": "Burt Bear",
        "profilePic": "assets/img/speakers/bear.jpg",
        "about": "Burt is a Bear."
      },
      {
        "name": "Paul Puppy",
        "profilePic": "assets/img/speakers/puppy.jpg",
        "about": "Paul is a Puppy."
      }
    ];

    for (let item of items) {
      this.items.push(new Item(item));
    }
  }

  query(params?: any) {
    console.log('todooo');
    return this.items;
    // return this.api.get('/items', params);

    // if (!params) {
    //   return this.items;
    // }
    //
    // return this.items.filter((item) => {
    //   for (let key in params) {
    //     let field = item[key];
    //     if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
    //       return item;
    //     } else if (field == params[key]) {
    //       return item;
    //     }
    //   }
    //   return null;
    // });
  }

  add(item: Item) {
    // this.items.push(item);
  }

  delete(item: Item) {
    // this.items.splice(this.items.indexOf(item), 1);
  }

}
