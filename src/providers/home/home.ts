import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';

@Injectable()
export class HomeProvider {

  URL;
  public headers = new HttpHeaders();
  public formData: FormData = new FormData();

  constructor(public http: HttpClient, ) {

    console.log('Hello HomeProvider Provider');
    this.headers.set('Access-Control-Allow-Origin', '*');
    this.headers.set('Cookie', 'currency=INR');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  apiBanners() {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/module/banner';
    this.formData.append('customer_id', '');
    this.formData.append('currency', '');
    this.formData.append('language', '');
    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiBannerDetails(data: any) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/module/banner/detail';

    this.formData.append('banner_id', data.id);
    this.formData.append('customer_id', '');
    this.formData.append('currency', data.currency_id);
    this.formData.append('language', data.language_id);
    this.formData.append('width', '');
    this.formData.append('height', '');

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiFeatured(data: any) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/module/featured';

    this.formData.append('banner_id', data.id);
    this.formData.append('customer_id', '');
    this.formData.append('currency', data.currency_id);
    this.formData.append('language', data.language_id);
    this.formData.append('limit', '10');
    this.formData.append('width', '');
    this.formData.append('height', '');

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiLatest(data: any) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/module/latest';

    this.formData.append('banner_id', data.id);
    this.formData.append('customer_id', '');
    this.formData.append('currency', data.currency_id);
    this.formData.append('language', data.language_id);
    this.formData.append('limit', '10');
    this.formData.append('width', '');
    this.formData.append('height', '');

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiBestseller(data: any) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/module/bestseller';

    this.formData.append('banner_id', data.banner_id);
    this.formData.append('customer_id', '');
    this.formData.append('currency', data.currency_id);
    this.formData.append('language', data.language_id);
    this.formData.append('limit', '10');
    this.formData.append('width', '');
    this.formData.append('height', '');

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiSpecial(data: any) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/module/special';

    this.formData.append('banner_id', data.id);
    this.formData.append('customer_id', '');
    this.formData.append('currency', data.currency_id);
    this.formData.append('language', data.language_id);
    this.formData.append('limit', '10');
    this.formData.append('width', '');
    this.formData.append('height', '');

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiTestimonials(data: any) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/module/testimonials';

    this.formData.append('banner_id', data.id);
    this.formData.append('customer_id', '');
    this.formData.append('currency', '');
    this.formData.append('language', '');
    this.formData.append('limit', '10');
    this.formData.append('width', '');
    this.formData.append('height', '');

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

}
