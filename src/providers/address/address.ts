import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigProvider } from '../config/config';
import { LoginProvider } from '../login/login';

// Set timeout for response
import 'rxjs/add/operator/timeout';
@Injectable()
export class AddressProvider {

  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  public responseData: any;
  private URL;

  constructor(public http: HttpClient,
    public loginProvider: LoginProvider, ) {

    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  getAddress() {

    this.formData = new FormData();
    this.formData.append('customer_id', this.loginProvider.customer_id);

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/account/address';
    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }

  apiViewAddress(address_id: any) {

    this.formData = new FormData();
    this.formData.append('customer_id', this.loginProvider.customer_id);

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/account/address/getDetail&address_id=' + address_id;

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }

  addAddress(data: any): any {

    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/account/address/add';

    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('firstname', data.firstname);
    this.formData.append('lastname', data.lastname);
    this.formData.append('address_1', data.address);
    this.formData.append('address_2', data.address2);
    this.formData.append('city', data.city);
    this.formData.append('company', '');
    this.formData.append('postcode', data.postcode);
    this.formData.append('country_id', data.country_id);
    this.formData.append('zone_id', data.zone_id);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  addPaymentAddress(data: any): any {

    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/payment/address';

    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('firstname', data.firstname);
    this.formData.append('lastname', data.lastname);
    this.formData.append('address_1', data.address);
    this.formData.append('address_2', data.address2);
    this.formData.append('city', data.city);
    this.formData.append('company', '');
    this.formData.append('postcode', data.postcode);
    this.formData.append('country_id', data.country_id);
    this.formData.append('zone_id', data.zone_id);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  addShippingAddress(data: any): any {

    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/checkout/shipping/address';

    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('firstname', data.firstname);
    this.formData.append('lastname', data.lastname);
    this.formData.append('address_1', data.address);
    this.formData.append('address_2', data.address2);
    this.formData.append('city', data.city);
    this.formData.append('company', '');
    this.formData.append('postcode', data.postcode);
    this.formData.append('country_id', data.country_id);
    this.formData.append('zone_id', data.zone_id);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  editAddress(data: any, address_id: any): any {

    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/account/address/edit&address_id=' + address_id;

    this.formData.append('customer_id', this.loginProvider.customer_id);
    this.formData.append('firstname', data.firstname);
    this.formData.append('lastname', data.lastname);
    this.formData.append('address_1', data.address);
    this.formData.append('address_2', data.address2);
    this.formData.append('city', data.city);
    this.formData.append('company', '');
    this.formData.append('postcode', data.postcode);
    this.formData.append('country_id', data.country_id);
    this.formData.append('zone_id', data.zone_id);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  removeAddress(data: any): any {

    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/account/address/delete&address_id=' + data.address_id;

    this.formData.append('customer_id', this.loginProvider.customer_id);

    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  getCountry(): any {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/account/address/countries';
    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  getZone(id): any {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + '?route=restapi/account/address/zones&country_id=' + id;
    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  getDistrict(id): any {
    // this.URL = ConfigProvider.BASE_URL_ + 'district?zone_id=' + id;
    if (id != 0) {
      this.URL = ConfigProvider.BASE_URL + 'district?zone_id=' + id;
    } else {
      this.URL = ConfigProvider.BASE_URL + 'district?zone_id=' + '28';
    }
    return this.http.get(this.URL,
      {
        headers: this.headers,
      }
    );
  }
}
