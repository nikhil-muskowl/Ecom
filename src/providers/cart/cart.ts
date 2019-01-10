import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigProvider } from '../config/config';
import { LoginProvider } from '../login/login';
// Set timeout for response
import 'rxjs/add/operator/timeout';


@Injectable()
export class CartProvider {

  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  public responseData: any;
  private URL;

  constructor(
    public http: HttpClient,
    public loginProvider: LoginProvider) {

    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  products(data: any) {

    this.formData = new FormData();
    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('language', data.language_id);
    this.formData.append('currency', data.currency_id);

    if (data.payment_address_id) {
      this.formData.append('payment_address_id', data.payment_address_id);
    }
    if (data.shipping_address_id) {
      this.formData.append('shipping_address_id', data.shipping_address_id);
    }
    if (data.shipping_method) {
      this.formData.append('shipping_method', data.shipping_method);
    }
    if (data.payment_method) {
      this.formData.append('payment_method', data.payment_method);
    }

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/cart';

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }

  orderCheckout(data: any) {

    this.formData = new FormData();
    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('language', data.language_id);
    this.formData.append('currency', data.currency_id);

    if (data.payment_address_id) {
      this.formData.append('payment_address_id', data.payment_address_id);
    }
    if (data.shipping_address_id) {
      this.formData.append('shipping_address_id', data.shipping_address_id);
    }
    if (data.shipping_method) {
      this.formData.append('shipping_method', data.shipping_method);
    }
    if (data.payment_method) {
      this.formData.append('payment_method', data.payment_method);
    }

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/order/add';

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);

  }

  add(data: any): any {
    this.formData = new FormData();
    console.log(data);
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/cart/add';
    this.formData.append('customer_id', data.customer_id);
    this.formData.append('product_id', data.product_id);
    // this.formData.append('detail_id', data.detail_id);
    this.formData.append('quantity', data.quantity);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  edit(data: any): any {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/cart/edit';

    this.formData.append('key', data.cart_id);
    this.formData.append('quantity', data.quantity);
    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('language', data.language_id);
    this.formData.append('currency', data.currency_id);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  remove(data: any, language_id, currency_id): any {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/cart/remove';
    this.formData.append('key', data.cart_id);
    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('language', language_id);
    this.formData.append('currency', currency_id);
    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  getTermCondition() {
    this.URL = ConfigProvider.BASE_URL + 'termandcondition';
    return this.http.get(this.URL,
      {
        headers: this.headers,
      }
    );
  }
}
