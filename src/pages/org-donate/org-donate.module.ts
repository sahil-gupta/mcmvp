import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { OrgDonatePage } from './org-donate';

@NgModule({
  declarations: [
    OrgDonatePage,
  ],
  imports: [
    IonicPageModule.forChild(OrgDonatePage),
    TranslateModule.forChild()
  ],
  exports: [
    OrgDonatePage
  ]
})
export class OrgDonatePageModule { }
