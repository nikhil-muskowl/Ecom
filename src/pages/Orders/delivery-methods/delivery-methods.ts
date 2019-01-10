import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { PaymentsProvider } from '../../../providers/payments/payments';
import { LoginProvider } from '../../../providers/login/login';
import { AlertController, Alert } from 'ionic-angular';
import { PaymentMethodsPage } from '../payment-methods/payment-methods';
import { SettingsProvider } from '../../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-delivery-methods',
  templateUrl: 'delivery-methods.html',
})
export class DeliveryMethodsPage {

  public customer_id;
  language_id;
  currency_id;
  public payment_address_id;
  public shipping_address_id;
  public shipping_code;
  public alert: Alert;

  //address details to save
  public responseAddData;
  public params;
  public responseshippingData;
  shipping_methods: any = [];

  //txt
  public heading_title;
  public use_exist_address;
  public use_new_address;
  public continue_txt;
  public add_new_address_txt;
  public server_slow_txt;
  public oops_txt;
  public exit_app_txt;
  public smthng_wrong;
  public ok_txt;
  public success_txt;

  private success;
  private error_warning;

  public responseData;
  public status;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public settingsProvider: SettingsProvider,
    public loginProvider: LoginProvider,
    public translate: TranslateService,
    public paymentsProvider: PaymentsProvider,
    public alertCtrl: AlertController,
    public languageProvider: LanguageProvider, ) {

    this.setText();
    this.language_id = this.languageProvider.getLanguage();
    this.currency_id = this.settingsProvider.getCurrData();
    this.payment_address_id = this.navParams.get('payment_address_id');
    this.shipping_address_id = this.navParams.get('shipping_address_id');

    platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.getServerData();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('delivery_method').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('use_exist_address').subscribe((text: string) => {
      this.use_exist_address = text;
    });
    this.translate.get('use_new_address').subscribe((text: string) => {
      this.use_new_address = text;
    });
    this.translate.get('add_new_address').subscribe((text: string) => {
      this.add_new_address_txt = text;
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
  }

  getServerData() {
    this.shipping_methods = [];
    let params = {
      language_id: this.language_id,
      currency_id: this.currency_id,
      address_id: this.shipping_address_id,
    };
    this.loadingProvider.present();
    this.paymentsProvider.getDeliveryMethods(params).subscribe(
      response => {
        this.responseData = response;
        this.status = this.responseData.status;

        if (this.status) {
          this.shipping_methods = this.responseData.shipping_methods;
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
                  this.getServerData();
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

  deliveryChange(shipping) {
    console.log("Selected shipping_code : " + JSON.stringify(shipping.quote[0].code));
    this.shipping_code = shipping.quote[0].code;
  }

  goBack() {
    this.navCtrl.pop();
  }

  save() {
    if (this.shipping_code) {
      // this.loadingProvider.show();

      // this.paymentsProvider.apiSetPaymentMethods(this.shipping_code).subscribe(
      //   response => {

      //     this.responseshippingData = response;
      //     console.log("this.responseshippingData : " + JSON.stringify(this.responseshippingData));
      //     if (this.responseshippingData.status) {

      let params = {
        payment_address_id: this.payment_address_id,
        shipping_address_id: this.shipping_address_id,
        shipping_method: this.shipping_code
      }
      this.navCtrl.push(PaymentMethodsPage, params);
      //     }
      //     this.loadingProvider.dismiss();
      //   },
      //   err => console.error(err),
      //   () => {
      //     this.loadingProvider.dismiss();
      //   }
      // );
    }
  }
}
