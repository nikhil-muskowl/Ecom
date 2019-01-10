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

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  public terms;
  language_id;
  currency_id;
  public products: any = [];
  public totals;
  submitAttempt;

  public hasProducts: Boolean = false;

  cartForm: FormGroup;
  private formData: any;
  private status;
  private message;
  private responseData;
  private success;
  private error_warning;
  private cart_quantity = 1;
  private field_error;
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
  public place_order_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
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

    this.from = this.navParams.get('from');
    this.setText();
    this.isLogin();
    this.getProducts();
    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });
  }

  goBack() {
    if (this.from == 'home') {
      this.navCtrl.setRoot(HomePage);
    }
    else {
      this.navCtrl.pop();
    }
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    console.log("getLanguage() : " + this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('my_cart').subscribe((text: string) => {
      this.heading_title = text;
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
    this.translate.get('place_order').subscribe((text: string) => {
      this.place_order_txt = text;
    });
  }

  isLogin() {

    if (!this.loginProvider.customer_id) {
      //this.navCtrl.push(CustomerLoginPage);
      this.navCtrl.setRoot(LoginPage);
    }
  }

  public getProducts() {
    this.products = [];
    let param = {
      language_id: this.language_id,
      currency_id: this.currency_id
    };
    //this.loadingProvider.present();
    this.cartProvider.products(param).subscribe(
      response => {
        console.log('Cart response : ' + JSON.stringify(response));
        if (response) {
          this.products = response.products;
          this.totals = response.totals;
          if (this.products && this.products.length > 0) {
            this.hasProducts = true;
          } else {
            this.hasProducts = false;
          }
        }
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

  public remove(data) {
    this.loadingProvider.present();
    this.cartProvider.remove(data, this.language_id, this.currency_id).subscribe(
      response => {
        this.getProducts();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
    return event;
  }

  createForm() {
    this.cartForm = this.formBuilder.group({
      quantity: ['', Validators.required]
    });
  }

  save(data) {
    this.submitAttempt = true;

    if (this.cartForm.valid) {
      this.formData = {
        quantity: this.cartForm.value.quantity,
        cart_id: Number(data.cart_id)
      };

      this.loadingProvider.present();
      this.cartProvider.edit(this.formData).subscribe(
        response => {

          this.responseData = response;
          this.submitAttempt = true;

          if (this.responseData.success && this.responseData.success != '') {
            this.success = this.responseData.success;
            this.alertProvider.title = this.success_txt;
            this.alertProvider.message = this.success;
            this.alertProvider.showAlert();
            this.cartForm.reset();
            this.submitAttempt = false;
          }

          if (this.responseData.error && this.responseData.error != '') {

            this.error_warning = this.responseData.error.store;

            this.alertProvider.title = this.warning_txt;
            this.alertProvider.message = this.error_warning;
            this.alertProvider.showAlert();
          }

          this.getProducts();

        },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        }
      );
    }

  }

  goToCheckout() {
    var alert = this.alertCtrl.create({
      title: this.confirm_txt,
      message: this.want_continue,
      buttons: [
        {
          text: this.cancel_txt,
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: this.yes_txt,
          handler: () => {
            // this.navCtrl.push(CartCheckoutPage);
            this.navCtrl.push(PaymentAddressPage);
          }
        }
      ]
    });

    alert.present();
  }

  public edit(data) {
    let param = {
      cart_id: data.cart_id,
      quantity: data.quantity
    };
    this.modalProvider.presentProfileModal(CartEditPage, param);

    this.modalProvider.modal.onDidDismiss(data => {
      // This is added to refresh page.
      // this.navCtrl.push(this.navCtrl.getActive().component);
      this.getProducts();
    });
  }

  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }
}
