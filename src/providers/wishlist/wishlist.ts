import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigProvider } from '../config/config';
import { LoginProvider } from '../login/login';

// Set timeout for response
import 'rxjs/add/operator/timeout';

@Injectable()
export class WishlistProvider {


  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  public responseData: any;
  private URL;

  constructor(public http: HttpClient,
    public loginProvider: LoginProvider, ) {

    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  getWishlist() {

    this.formData = new FormData();
    this.formData.append('customer_id', this.loginProvider.customer_id);

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/account/wishlist';
    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }

  addWishlist(data: any): any {

    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/account/wishlist/add';

    this.formData.append('customer_id', data.customer_id);
    this.formData.append('product_id', data.product_id);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  removeWishlist(data: any): any {

    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/account/wishlist/remove';

    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('product_id', data.product_id);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

}
