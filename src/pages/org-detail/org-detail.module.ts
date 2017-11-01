import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { OrgDetailPage } from './org-detail';

@NgModule({
  declarations: [
    OrgDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OrgDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    OrgDetailPage
  ]
})
export class OrgDetailPageModule { }
