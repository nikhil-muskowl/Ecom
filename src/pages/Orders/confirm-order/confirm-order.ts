import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, Alert } from 'ionic-angular';

import { CategoryProvider } from '../../../providers/category/category';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoginProvider } from '../../../providers/login/login';
import { CartProvider } from '../../../providers/cart/cart';
import { HomePage } from '../../Main/home/home';
import { LoginPage } from '../../Account/login/login';
import { ModalProvider } from '../../../providers/modal/modal';
import { CartEditPage } from '../cart-edit/cart-edit';
import { PaymentAddressPage } from '../payment-address/payment-address';
import { SettingsProvider } from '../../../providers/settings/settings';

import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { ConfigProvider } from '../../../providers/config/config';

@IonicPage()
@Component({
  selector: 'page-confirm-order',
  templateUrl: 'confirm-order.html',
})
export class ConfirmOrderPage {

  public terms;
  public payment_address_id;
  public shipping_address_id;
  public shipping_method;
  public payment_method;

  language_id;
  currency_id;
  public products: any = [];
  public totals;
  submitAttempt;

  public hasProducts: Boolean = false;
  public alert: Alert;
  from;

  //txt
  public heading_title;
  public empty_cart;
  public shop_now;
  public server_slow_txt;
  public oops_txt;
  public exit_app_txt;
  public continue_txt;
  public smthng_wrong;
  public ok_txt;
  public want_continue;
  public cancel_txt;
  public success_txt;
  public warning_txt;
  public confirm_txt;
  public yes_txt;
  public confirm_order_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private payPal: PayPal,
    public settingsProvider: SettingsProvider,
    public formBuilder: FormBuilder,
    public modalProvider: ModalProvider,
    public categoryProvider: CategoryProvider,
    public alertProvider: AlertProvider,
    private alertCtrl: AlertController,
    public loadingProvider: LoadingProvider,
    public loginProvider: LoginProvider,
    public cartProvider: CartProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {

    this.language_id = this.languageProvider.getLanguage();
    this.currency_id = this.settingsProvider.getCurrData();

    this.setText();

    this.payment_address_id = this.navParams.get('payment_address_id');
    this.shipping_address_id = this.navParams.get('shipping_address_id');
    this.shipping_method = this.navParams.get('shipping_method');
    this.payment_method = this.navParams.get('payment_method');

    this.isLogin();
    this.getProducts();

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    console.log("getLanguage() : " + this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('confirm_order').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('confirm_order').subscribe((text: string) => {
      this.confirm_order_txt = text;
    });
    this.translate.get('empty_cart').subscribe((text: string) => {
      this.empty_cart = text;
    });
    this.translate.get('shop_now').subscribe((text: string) => {
      this.shop_now = text;
    });
    this.translate.get('server_slow').subscribe((text: string) => {
      this.server_slow_txt = text;
    });
    this.translate.get('oops').subscribe((text: string) => {
      this.oops_txt = text;
    });
    this.translate.get('exit_app').subscribe((text: string) => {
      this.exit_app_txt = text;
    });
    this.translate.get('continue').subscribe((text: string) => {
      this.continue_txt = text;
    });
    this.translate.get('smthng_wrong').subscribe((text: string) => {
      this.smthng_wrong = text;
    });
    this.translate.get('ok').subscribe((text: string) => {
      this.ok_txt = text;
    });
    this.translate.get('want_continue').subscribe((text: string) => {
      this.want_continue = text;
    });
    this.translate.get('cancel').subscribe((text: string) => {
      this.cancel_txt = text;
    });
    this.translate.get('success').subscribe((text: string) => {
      this.success_txt = text;
    });
    this.translate.get('warning').subscribe((text: string) => {
      this.warning_txt = text;
    });
    this.translate.get('confirm').subscribe((text: string) => {
      this.confirm_txt = text;
    });
    this.translate.get('yes').subscribe((text: string) => {
      this.yes_txt = text;
    });
  }

  isLogin() {

    if (!this.loginProvider.customer_id) {
      this.navCtrl.setRoot(LoginPage);
    }
  }

  public getProducts() {
    this.products = [];
    let param = {
      language_id: this.language_id,
      currency_id: this.currency_id,
      payment_address_id: this.payment_address_id,
      shipping_address_id: this.shipping_address_id,
      shipping_method: this.shipping_method,
      payment_method: this.payment_method,
    };
    this.loadingProvider.present();
    this.cartProvider.products(param).subscribe(
      response => {
        if (response) {
          this.products = response.products;
          this.totals = response.totals;
          if (this.products && this.products.length > 0) {
            this.hasProducts = true;
          } else {
            this.hasProducts = false;
          }
        }
        this.loadingProvider.dismiss();
      },
      err => {
        if (err.name == 'TimeoutError') {
          this.alert = this.alertCtrl.create({
            title: this.oops_txt,
            message: this.server_slow_txt,
            buttons: [
              {
                text: this.exit_app_txt,
                handler: () => {
                  this.platform.exitApp();
                }
              },
              {
                text: this.continue_txt,
                handler: () => {
                  this.getProducts();
                }
              }
            ]
          });
          this.alert.present();
          this.loadingProvider.dismiss();
        } else {
          this.alert = this.alertCtrl.create({
            title: this.oops_txt,
            message: this.smthng_wrong,
            buttons: [
              {
                text: this.ok_txt,
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

  goToCheckout() {

    let param = {
      language_id: this.language_id,
      currency_id: this.currency_id,
      payment_address_id: this.payment_address_id,
      shipping_address_id: this.shipping_address_id,
      shipping_method: this.shipping_method,
      payment_method: this.payment_method,
    };

    this.loadingProvider.present();
    this.cartProvider.orderCheckout(param).subscribe(
      response => {
        if (response) {
          var order_id = response.order_id;
          console.log("confirm payment order_id : " + order_id);
          this.makePayment(order_id);
        }
        this.loadingProvider.dismiss();
      },
      err => {
        this.loadingProvider.dismiss();
        if (err.name == 'TimeoutError') {
          this.alert = this.alertCtrl.create({
            title: this.oops_txt,
            message: this.server_slow_txt,
            buttons: [
              {
                text: this.exit_app_txt,
                handler: () => {
                  this.platform.exitApp();
                }
              },
              {
                text: this.continue_txt,
                handler: () => {
                  this.goToCheckout();
                }
              }
            ]
          });
          this.alert.present();
        } else {
          this.alert = this.alertCtrl.create({
            title: this.oops_txt,
            message: this.smthng_wrong,
            buttons: [
              {
                text: this.ok_txt,
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
  }

  makePayment(order_id) {
    console.log('In payment');
    this.payPal.init({
      PayPalEnvironmentProduction: '',
      PayPalEnvironmentSandbox: ConfigProvider.payPalEnvironmentSandbox
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment('1233.33', this.currency_id, order_id, '');
        this.payPal.renderSinglePaymentUI(payment).then(() => {

          console.log(JSON.stringify(payment));
          // Successfully paid

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          // Error or render dialog closed without being successful
          console.error('Error or render dialog closed without being successful');
        });
      }, () => {
        // Error in configuration
        console.error('Error in configuration');
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
      console.error('Error in initialization, maybe PayPal isn\'t supported or something else');
    });

  }
}
