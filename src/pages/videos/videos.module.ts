import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { VideosPage } from './videos';

@NgModule({
  declarations: [
    VideosPage,
  ],
  imports: [
    IonicPageModule.forChild(VideosPage),
    TranslateModule.forChild()
  ],
  exports: [
    VideosPage
  ]
})
export class VideosPageModule { }
