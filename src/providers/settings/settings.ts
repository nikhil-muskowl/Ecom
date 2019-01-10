import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigProvider } from '../config/config';
import { LoginProvider } from '../login/login';

@Injectable()
export class SettingsProvider {

  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  public URL;
  public customer_id;

  constructor(public http: HttpClient,
    public loginProvider: LoginProvider) {
    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
    this.customer_id = this.loginProvider.getData();
  }

  apigetCurrencies(): any {

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/currency';

    return this.http.get<any>(this.URL,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }


  apiUserSetCurrencies(currency): any {

    this.formData = new FormData();
    this.formData.append('currency', currency);

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/currency/change';

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }

  getCurrData() {
    try {
      if (window.localStorage.getItem('currency')) {
        return window.localStorage.getItem('currency');
      } else {
        return 'USD';
      }

    } catch (error) {
      return 'USD';
    }
  }

  public setCurrency(code) {
    console.log("Set currency : " + code);
    try {
      window.localStorage.setItem('currency', code);
    } catch (error) {
    }
  }
}
