import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoginProvider } from '../../../providers/login/login';
import { AlertController, Alert } from 'ionic-angular';
import { OrderProvider } from '../../../providers/order/order';
import { ProductDetailsPage } from '../../Products/product-details/product-details';
import { LoginPage } from '../../Account/login/login';


@IonicPage()
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {

  public order_id;
  public customer_id;

  public invoice_no;
  public date_added;
  public payment_address;
  public payment_method;
  public shipping_address;
  public shipping_method;
  public products;
  public vouchers;
  public status;
  public totals;
  public comment;
  public histories;
  private responseData;
  private success;
  private error_warning;

  public alert: Alert;

  //txt
  public heading_title;
  public products_txt;
  public date_;
  public order_no_;
  public oops;
  public ok;
  public continue;
  public smthng_wrong;
  public server_slow;
  public exit_app;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public loginProvider: LoginProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
    public orderProvider: OrderProvider,
    public alertCtrl: AlertController,
  ) {

    this.setText();
    this.isLogin();
    this.order_id = this.navParams.get('order_id');
    console.log('Order id : ' + this.order_id);
    this.getServerData();

    platform.registerBackButtonAction(() => {
      this.goBack();
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('order_details').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('oops').subscribe((text: string) => {
      this.oops = text;
    });
    this.translate.get('continue').subscribe((text: string) => {
      this.continue = text;
    });
    this.translate.get('ok').subscribe((text: string) => {
      this.ok = text;
    });
    this.translate.get('smthng_wrong').subscribe((text: string) => {
      this.smthng_wrong = text;
    });
    this.translate.get('server_slow').subscribe((text: string) => {
      this.server_slow = text;
    });
    this.translate.get('exit_app').subscribe((text: string) => {
      this.exit_app = text;
    });
  }

  public getServerData() {
    this.loadingProvider.present();
    this.orderProvider.getOrderDetail(this.order_id).subscribe(
      response => {
       
        this.responseData = response.data;
        this.error_warning = this.responseData.error_warning;
        this.success = this.responseData.success;
        this.status = this.responseData.status;
        this.invoice_no = this.responseData.invoice_no;
        this.order_id = this.responseData.order_id;
        this.date_added = this.responseData.date_added;
        this.payment_address = this.responseData.payment_address;
        this.payment_method = this.responseData.payment_method;
        this.shipping_address = this.responseData.shipping_address;
        this.shipping_method = this.responseData.shipping_method;
        this.products = this.responseData.products;
        this.vouchers = this.responseData.vouchers;
        this.totals = this.responseData.totals;
        this.comment = this.responseData.comment;
        this.histories = this.responseData.histories;

        this.loadingProvider.dismiss();
      },
      err => {
        if (err.name == 'TimeoutError') {
          this.alert = this.alertCtrl.create({
            title: this.oops,
            message: this.server_slow,
            buttons: [
              {
                text: this.exit_app,
                handler: () => {
                  this.platform.exitApp();
                }
              },
              {
                text: this.continue,
                handler: () => {
                  this.getServerData();
                }
              }
            ]
          });
          this.alert.present();
        } else {
          this.alert = this.alertCtrl.create({
            title: this.oops,
            message: this.smthng_wrong,
            buttons: [
              {
                text: this.ok,
                handler: () => {
                  this.platform.exitApp();
                }
              },
            ]
          });
          this.alert.present();
        }
        this.loadingProvider.dismiss();
      },
      () => {
        this.loadingProvider.dismiss();
      }
    );
    return event;
  }

  isLogin() {
    console.log("Customer id " + this.loginProvider.getData());
    if (!this.loginProvider.getData()) {
      this.navCtrl.push(LoginPage);
    }

  }

  viewDetail(data: any) {
    this.navCtrl.push(ProductDetailsPage, { id: data.product_id });
  }
}
