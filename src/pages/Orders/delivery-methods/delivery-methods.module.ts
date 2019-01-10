import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryMethodsPage } from './delivery-methods';

@NgModule({
  declarations: [
    DeliveryMethodsPage,
  ],
  imports: [
    IonicPageModule.forChild(DeliveryMethodsPage),
  ],
})
export class DeliveryMethodsPageModule {}
