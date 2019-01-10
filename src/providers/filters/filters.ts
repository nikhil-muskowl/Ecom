import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';
import { LoginProvider } from '../login/login';


@Injectable()
export class FiltersProvider {

  URL;
  public headers = new HttpHeaders();
  public formData: FormData = new FormData();

  constructor(public http: HttpClient,
    public loginProvider: LoginProvider) {
    console.log('Hello CategoryProvider Provider');
    this.headers.set('Access-Control-Allow-Origin', '*');
    this.headers.set('Cookie', 'currency=INR');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  apiCountryOrigins() {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/product/country_origin';

    return this.http.get<any>(this.URL,
      {
        headers: this.headers,
      }
    );
  }

  apiBrands(data: any) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/product/manufacturer';

    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('language', data.language_id);
    this.formData.append('currency', data.currency_id);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiprices(data: any) {

    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/product/price_slider';

    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('language', data.language_id);
    this.formData.append('currency', data.currency_id);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }
}
