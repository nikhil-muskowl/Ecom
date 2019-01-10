import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';
import { LoginProvider } from '../login/login';

@Injectable()
export class CategoryProvider {

  URL;
  public headers = new HttpHeaders();
  public formData: FormData = new FormData();

  constructor(public http: HttpClient,
    public loginProvider: LoginProvider) {
    console.log('Hello CategoryProvider Provider');
    this.headers.set('Access-Control-Allow-Origin', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  apiCategory(data) {

    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/category';

    this.formData.append('language', data.language_id);
    this.formData.append('currency', data.currency_id);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiProductList(data: any) {

    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/product/search'

    this.formData.append('language', data.language_id);
    this.formData.append('currency', data.currency_id);

    if (data.page) {
      this.URL += '&page=' + data.page;
    }
    if (data.sort) {
      this.URL += '&sort=' + data.sort;
    }
    if (data.order) {
      this.URL += '&order=' + data.order;
    }
    if (data.search) {
      this.URL += '&search=' + data.search;
    }
    if (data.category_filter) {
      this.URL += '&category_filter=' + data.category_filter;
    }
    if (data.brand_filter) {
      this.URL += '&brand_filter=' + data.brand_filter;
    }
    if (data.country_origin_filter) {
      this.URL += '&country_origin_filter=' + data.country_origin_filter;
    }
    if (data.price_filter) {
      this.URL += '&pr=' + data.price_filter;
    }

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiProductDetails(id) {

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/product&product_id=' + id;

    return this.http.get<any>(this.URL,
      {
        headers: this.headers,
      }
    );
  }

  public getReviews(data, product_id): any {

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/product/product/review&product_id=' + product_id;

    this.formData = new FormData();

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

  public postReviews(product_id, data): any {
    
    this.formData = new FormData();
    this.formData.append('product_id', product_id);
    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('name', data.name);
    this.formData.append('text', data.text);
    this.formData.append('rating', data.rating);

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/product/product/write&product_id=' + product_id;

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  public apispecialOffer(data: any) {

    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/product/special';

    this.formData.append('language', data.language_id);
    this.formData.append('currency', data.currency_id);
    this.formData.append('customer_id', data.customer_id);

    if (data.page) {
      this.URL += '&page=' + data.page;
    }
    if (data.sort) {
      this.URL += '&sort=' + data.sort;
    }
    if (data.order) {
      this.URL += '&order=' + data.order;
    }
    if (data.search) {
      this.URL += '&search=' + data.search;
    }
    if (data.category_filter) {
      this.URL += '&category_filter=' + data.category_filter;
    }
    if (data.brand_filter) {
      this.URL += '&brand_filter=' + data.brand_filter;
    }
    if (data.country_origin_filter) {
      this.URL += '&country_origin_filter=' + data.country_origin_filter;
    }
    if (data.price_filter) {
      this.URL += '&pr=' + data.price_filter;
    }

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  public decodeEntities(encodedString) {
    var parser = new DOMParser;
    var dom = parser.parseFromString(
      '<!doctype html><body>' + encodedString,
      'text/html');
    var decodedString = dom.body.textContent;
    return decodedString;
  }
}
