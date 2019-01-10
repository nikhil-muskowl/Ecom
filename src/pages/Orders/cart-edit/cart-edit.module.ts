import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartEditPage } from './cart-edit';

@NgModule({
  declarations: [
    CartEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CartEditPage),
  ],
})
export class CartEditPageModule {}
