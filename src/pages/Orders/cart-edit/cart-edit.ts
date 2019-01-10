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
import { ModalProvider } from '../../../providers/modal/modal';
import { SettingsProvider } from '../../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-cart-edit',
  templateUrl: 'cart-edit.html',
})
export class CartEditPage {

  submitAttempt;
  language_id;
  currency_id;
  cartForm: FormGroup;
  private formData: any;
  private status;
  private message;
  private responseData;
  private success;
  private error_warning;
  private field_error;
  private cart_id;
  private cart_quantity;

  //txt
  public heading_title;
  public cancel_txt;
  public quantity_txt;
  public add_to_cart;
  public empty_cart;
  public shop_now;
  public server_slow_txt;
  public oops_txt;
  public exit_app_txt;
  public continue_txt;
  public smthng_wrong;
  public ok_txt;
  public want_continue;
  public success_txt;
  public warning_txt;
  public confirm_txt;
  public yes_txt;

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
    public languageProvider: LanguageProvider, ) {

    this.setText();
    this.language_id = this.languageProvider.getLanguage();
    this.currency_id = this.settingsProvider.getCurrData();
    this.createForm();
    if (navParams.get('cart_id')) {
      this.cart_id = navParams.get('cart_id');
      this.cart_quantity = navParams.get('quantity');
    } else {
      this.cart_id = null;
    }
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    console.log("getLanguage() : " + this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('edit_cart').subscribe((text: string) => {
      this.heading_title = text;
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
    this.translate.get('field_error').subscribe((text: string) => {
      this.field_error = text;
    });
    this.translate.get('quantity').subscribe((text: string) => {
      this.quantity_txt = text;
    });
    this.translate.get('add_to_cart').subscribe((text: string) => {
      this.add_to_cart = text;
    });
  }

  createForm() {
    this.cartForm = this.formBuilder.group({
      quantity: ['', Validators.required]
    });
  }

  save() {
    this.submitAttempt = true;

    if (this.cartForm.valid) {
      this.formData = {
        quantity: this.cartForm.value.quantity,
        cart_id: Number(this.cart_id),
        language_id: this.language_id,
        currency_id: this.currency_id
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
            this.dismiss();
          }

          if (this.responseData.error && this.responseData.error != '') {

            this.error_warning = this.responseData.error.store;

            this.alertProvider.title = this.warning_txt;
            this.alertProvider.message = this.error_warning;
            this.alertProvider.showAlert();
          }
        },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        }
      );
    }

  }

  dismiss() {
    this.modalProvider.dismiss();
  }

}
