import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';
import { LoginProvider } from '../login/login';

@Injectable()
export class PaymentsProvider {

  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  public responseData: any;
  private URL;

  constructor(public http: HttpClient,
    public loginProvider: LoginProvider, ) {

    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  getPaymentMethods(data:any) {

    this.formData = new FormData();
    this.formData = new FormData();
    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('language', data.language_id);
    this.formData.append('currency', data.currency_id);
    this.formData.append('address_id', data.address_id);
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/payment/methods';
    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }

  getDeliveryMethods(data: any) {

    this.formData = new FormData();
    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('language', data.language_id);
    this.formData.append('currency', data.currency_id);
    this.formData.append('address_id', data.address_id);

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/shipping/methods';
    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }

  apiSetPaymentMethods(payment_code) {
    this.formData = new FormData();
    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('payment_method', payment_code);

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/payment/method';
    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }

  apiSetDeliveryMethods(data: any) {
    this.formData = new FormData();
    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('shipping_method', data.shipping_method);

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/shipping/methods';
    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }
}
