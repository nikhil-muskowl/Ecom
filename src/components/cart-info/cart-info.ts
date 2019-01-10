import { Component } from '@angular/core';

/**
 * Generated class for the CartInfoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'cart-info',
  templateUrl: 'cart-info.html'
})
export class CartInfoComponent {

  text: string;

  constructor() {
    console.log('Hello CartInfoComponent Component');
    this.text = 'Hello World';
  }

}
