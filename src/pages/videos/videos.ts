import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-videos',
  templateUrl: 'videos.html'
})
export class VideosPage {
  videosDisplay;
  currentUser;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private iab: InAppBrowser,
    afAuth: AngularFireAuth,
    public http: HttpClient) {
      this.videosDisplay = [];

      // level 1
      afAuth.authState.subscribe((user: firebase.User) => {
        this.currentUser = user;
        if (!user) {
          console.log('no user');
          return;
        }

        var uid = this.currentUser.uid;

        // level 2
        firebase.database().ref('usersvideos/' + uid).orderByKey()
          .on('value', snapshot => {
            var tempvideoids = [];
            snapshot.forEach(childSnapshot => {
              var temp = childSnapshot.val(); // these are video ids
              tempvideoids.push(temp);
              return false;
            });
            // console.log(tempvideoids);

            tempvideoids = tempvideoids.reverse();

            for (let i in tempvideoids) {
              var videoid = tempvideoids[i];

              // convert from videoid in database to youtubeid
              firebase.database().ref('videos/' + videoid).once('value', snapshot => {

                var tempyoutubeid = snapshot.val().youtubeid;
                var url = "https://www.googleapis.com/youtube/v3/videos?id=";
                url += tempyoutubeid;
                url += "&part=snippet&key=AIzaSyBLZNjlJT";
                url += "R2-KP8OsuVJ3Pcdr0zKEjI";
                url += "oxY";

                console.log(url);

                // create closure
                (function(locali, localhttp, localurl, localtempyoutubeid, localvideosdisplay) {
                  localhttp.get(localurl).subscribe(result => {
                      if (!result || !result['items'])
                        return;

                      console.log(result);
                      var ref = result['items'][0].snippet;

                      var newobj: any = {}; // hydrate object
                      newobj.publishedAt = ref.publishedAt || '';
                      newobj.title = ref.title || '';
                      newobj.description = ref.description || '';
                      newobj.thumbnailurl = ref.thumbnails.medium.url || '';
                      newobj.youtubeid = localtempyoutubeid || '';
                      newobj.youtubeopenurl = 'https://www.youtube.com/watch?v=' + localtempyoutubeid;

                      localvideosdisplay[locali] = newobj; // make sure in order
                      console.log(JSON.stringify(localvideosdisplay, null, 4));
                  });
                })(i, this.http, url, tempyoutubeid, this.videosDisplay);

                return false;
              })
            }
          });
      });

  }

  openWebsite(website) {
    // const browser =
    this.iab.create(website, '_blank', 'location=no');
  }

}
