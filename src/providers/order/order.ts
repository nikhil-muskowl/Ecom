import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigProvider } from '../config/config';
import { LoginProvider } from '../login/login';

@Injectable()
export class OrderProvider {

  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  public URL;

  public customer_id: any;
  public fullname: any;
  public email: any;
  public mobile: any;
  public ImmediateShipping: any;
  public baddress: any;
  public bdistrict_id: any;
  public bpostcode: any;
  public bcity: any;
  public bzone_id: any;
  public saddress: any;
  public sdistrict_id: any;
  public spostcode: any;
  public scity: any;
  public szone_id: any;

  public order_id;
  public page;
  public limit;
  public sort;
  public order;

  constructor(public http: HttpClient,
    public loginProvider: LoginProvider) {
    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
    this.customer_id = this.loginProvider.getData();
  }

  setPaymentData(data: any) {
    this.bzone_id = data.zone_id;
    this.bdistrict_id = data.district_id;
    this.bcity = data.city;
    this.bpostcode = data.postcode;
    this.baddress = data.address;
  }

  setShippingData(data: any) {
    this.szone_id = data.zone_id;
    this.sdistrict_id = data.district_id;
    this.scity = data.city;
    this.spostcode = data.postcode;
    this.saddress = data.address;
  }

  addOrder(): any {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + 'checkoutcart';

    this.formData.append('customer_id', this.customer_id);
    this.formData.append('fullname', this.fullname);
    this.formData.append('email', this.email);
    this.formData.append('mobile', this.mobile);
    this.formData.append('ImmediateShipping', this.ImmediateShipping);

    this.formData.append('bdistrict_id', this.bdistrict_id);
    this.formData.append('bzone_id', this.bzone_id);
    this.formData.append('bpostcode', this.bpostcode);
    this.formData.append('bcity', this.bcity);
    this.formData.append('baddress', this.baddress);

    this.formData.append('sdistrict_id', this.sdistrict_id);
    this.formData.append('szone_id', this.szone_id);
    this.formData.append('spostcode', this.spostcode);
    this.formData.append('scity', this.scity);
    this.formData.append('saddress', this.saddress);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  getOrders(data): any {

    this.formData = new FormData();
    this.formData.append('customer_id', this.customer_id);

    this.page = data.page;
    this.limit = data.limit;
    this.sort = data.sort;
    this.order = data.order;

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/account/order';

    if (this.page) {
      this.URL += '&pageid=' + this.page;
    }
    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }

  getOrderDetail(order_id: any) {

    this.formData = new FormData();
    this.formData.append('customer_id', this.customer_id);

    this.URL = ConfigProvider.BASE_URL + '?route=restapi/account/order/info&order_id=' + order_id
    return this.http.post<any>(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).timeout(9000);
  }

  setRequest(data: any) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + 'submitrequest';
    this.formData.append('CustomerID', this.customer_id);
    this.formData.append('OrderRefNo', data.OrderRefNo);
    this.formData.append('Reason', data.Reason);
    this.formData.append('RequestType', data.RequestType);
    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  getRequests() {
    this.URL = ConfigProvider.BASE_URL + 'myrequest?customer_id=' + this.customer_id;
    return this.http.get(this.URL,
      {
        headers: this.headers,
      }
    ).timeout(9000);
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
