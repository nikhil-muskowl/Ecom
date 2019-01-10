import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecialOffersPage } from './special-offers';

@NgModule({
  declarations: [
    SpecialOffersPage,
  ],
  imports: [
    IonicPageModule.forChild(SpecialOffersPage),
  ],
})
export class SpecialOffersPageModule {}
