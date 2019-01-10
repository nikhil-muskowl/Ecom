import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoginProvider } from '../../../providers/login/login';
import { ProfilePage } from '../../Account/profile/profile';
import { LoginPage } from '../../Account/login/login';
import { AlertController, Alert } from 'ionic-angular';
import { OrderProvider } from '../../../providers/order/order';
import { OrderDetailsPage } from '../order-details/order-details';

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  public customer_id;
  public filterData;
  public responseData;
  public orders;

  public pagination;
  public sorts;
  public limits;
  public order_id;
  public rateValue;
  public sort;
  public order;
  public limit;
  public page = 1;
  public finalPage = 1;
  public isInfinite = true;
  public orderModel: any[] = [];
  public alert: Alert;

  //txt
  public heading_title;
  public oops;
  public continue;
  public ok;
  public smthng_wrong;
  public exit_app;
  public server_slow;

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

    platform.registerBackButtonAction(() => {
      this.goBack();
    });
  }

  ionViewWillEnter() {
    if (!this.loginProvider.customer_id) {
      this.navCtrl.push(LoginPage);
    } else {
      this.getServerData();
    }
  }

  goBack() {
    this.navCtrl.setRoot(ProfilePage);
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('my_orders').subscribe((text: string) => {
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
    this.translate.get('continue').subscribe((text: string) => {
      this.continue = text;
    });
    this.translate.get('exit_app').subscribe((text: string) => {
      this.exit_app = text;
    });
    this.translate.get('server_slow').subscribe((text: string) => {
      this.server_slow = text;
    });
  }

  public getServerData() {
    this.filterData = {
      'page': this.page,
      'limit': this.limit,
      'sort': this.sort,
      'order': this.order
    };

    this.loadingProvider.present();
    this.orderProvider.getOrders(this.filterData).subscribe(
      response => {
        this.responseData = response;
        this.orders = this.responseData.orders;
        this.pagination = this.responseData.pagination;
        this.sorts = this.responseData.sorts;
        this.limits = this.responseData.limits;
        this.binddata();
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
      },
      () => {
        this.loadingProvider.dismiss();
      }
    );
    return event;
  }

  binddata() {
    for (let index = 0; index < this.orders.length; index++) {
      this.orderModel.push({
        order_id: this.orders[index].order_id,
        name: this.orders[index].name,
        status: this.orders[index].status,
        date_added: this.orders[index].date_added,
        products: this.orders[index].products,
        total: this.orders[index].total,
      });
    }
  }

  doInfinite(infiniteScroll) {
    // if (this.orders.length > 0 && this.pagination.length != this.page) {
    //   this.page++;
    //   this.getServerData();
    //   this.isInfinite = true;
    // } else {
    //   this.isInfinite = false;
    // }
    // setTimeout(() => {
    //   infiniteScroll.complete();
    // }, 500);

    if (this.pagination.length > 0) {
      this.pagination.forEach(element => {
        this.finalPage = element;
      });
    }

    if (this.page != this.finalPage) {
      this.page++;
      this.getServerData();
      this.isInfinite = true;
      setTimeout(() => {
        infiniteScroll.complete();
      }, 500);
    } else {
      this.isInfinite = false;
    }
  }

  viewDetail(data: any) {
    this.navCtrl.push(OrderDetailsPage, { order_id: data.order_id });
  }
}
