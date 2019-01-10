import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';

@Injectable()
export class LanguageProvider {
  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  public responseData: any;
  private URL;

  public language;
  public language_id;

  constructor(public http: HttpClient) {
    this.language = 'en-gb';
    this.language_id = 1;

    this.language = this.getLanguage();
    this.language_id = this.getLanguageId();
  }

  apigetLanguages(): any {

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/product/language';

    return this.http.get<any>(this.URL,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }

  apiUserSetCurrencies(code): any {

    this.formData = new FormData();
    this.formData.append('code', code);

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/product/language/change';

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }


  public setLanguage(data) {
    try {
      window.localStorage.setItem('language_id', data.id);
      window.localStorage.setItem('language', data.code);
    } catch (error) {
    }
  }

  public getLanguage() {
    try {
      if (window.localStorage.getItem('language')) {
        return window.localStorage.getItem('language');
      } else {
        return 'en-gb';
      }

    } catch (error) {
      return 'en-gb';
    }
  }

  public setLanguageId(data) {
    try {
      window.localStorage.setItem('language_id', data.id);
    } catch (error) {
    }
  }

  public getLanguageId() {
    try {
      if (window.localStorage.getItem('language_id')) {
        return window.localStorage.getItem('language_id');
      } else {
        return '1';
      }
    } catch (error) {
      return '1';
    }
  }

}