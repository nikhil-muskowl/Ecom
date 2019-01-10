import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentAddressPage } from './payment-address';

@NgModule({
  declarations: [
    PaymentAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentAddressPage),
  ],
})
export class PaymentAddressPageModule {}
