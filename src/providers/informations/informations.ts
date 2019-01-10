import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';

@Injectable()
export class InformationsProvider {

  URL;
  public headers = new HttpHeaders();
  public formData: FormData = new FormData();

  constructor(public http: HttpClient, ) {

    console.log('Hello InfoProvider Provider');
    this.headers.set('Access-Control-Allow-Origin', '*');
    this.headers.set('Cookie', 'currency=INR');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  apiContactUs(data: any, language, currency) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/information/contact';

    this.formData.append('customer_id', '');
    this.formData.append('name', data.name);
    this.formData.append('email', data.email);
    this.formData.append('enquiry', data.enquiry);
    this.formData.append('language', language);
    this.formData.append('currency', currency);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiInformation(data: any) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/information/information';

    this.formData.append('customer_id', '');
    this.formData.append('language', data.language);
    this.formData.append('currency', data.currency);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiInformationDetails(data: any) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/information/information/detail&information_id=' + data.id;

    this.formData.append('customer_id', '');
    this.formData.append('language', data.language);
    this.formData.append('currency', data.currency);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

}
