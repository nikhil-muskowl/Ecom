import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { AddressProvider } from '../../../providers/address/address';
import { LoginProvider } from '../../../providers/login/login';
import { AlertController, Alert } from 'ionic-angular';
import { AddAddressPage } from '../../Account/add-address/add-address';
import { ModalProvider } from '../../../providers/modal/modal';
import { DeliveryMethodsPage } from '../delivery-methods/delivery-methods';

@IonicPage()
@Component({
  selector: 'page-shipping-address',
  templateUrl: 'shipping-address.html',
})
export class ShippingAddressPage {

  public customer_id;
  public payment_address_id;
  public shipping_address_id;
  public alert: Alert;

  //address details to save
  public responseAddData;
  public params;
  public responseshippingData;

  //address field
  responseAddrs;
  addresses: any = [];
  selectedAddress;

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
    public modalProvider: ModalProvider,
    public loadingProvider: LoadingProvider,
    public loginProvider: LoginProvider,
    public translate: TranslateService,
    public addressProvider: AddressProvider,
    public alertCtrl: AlertController,
    public languageProvider: LanguageProvider, ) {

    this.setText();
    this.payment_address_id = this.navParams.get('payment_address_id');

    platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.getServerData();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('shipping_address').subscribe((text: string) => {
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
    this.addresses = [];
    this.loadingProvider.present();
    this.addressProvider.getAddress().subscribe(
      response => {
        this.responseData = response;
        this.status = this.responseData.status;

        if (this.status) {
          this.addresses = this.responseData.addresses;
          this.selectedAddress = this.addresses[0];
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

  AddAddress() {
    let param;
    this.modalProvider.presentProfileModal(AddAddressPage, param);

    this.modalProvider.modal.onDidDismiss(data => {
      // This is added to refresh page.
      // this.navCtrl.push(this.navCtrl.getActive().component);
      this.getServerData();
    });
  }

  addressChange(address) {
    console.log("Select shipping address: " + JSON.stringify(address.address_id));
    this.shipping_address_id = address.address_id;
  }

  goBack() {
    this.navCtrl.pop();
  }

  save() {
    if (this.shipping_address_id) {
      // this.loadingProvider.show();
      // this.addressProvider.apiViewAddress(this.shipping_address_id).subscribe(
      //   response => {

      //     this.responseAddData = response.data;

      //     this.params = {
      //       firstname: this.responseAddData.firstname,
      //       lastname: this.responseAddData.lastname,
      //       address_1: this.responseAddData.address_1,
      //       address_2: this.responseAddData.address_2,
      //       postcode: this.responseAddData.postcode,
      //       city: this.responseAddData.city,
      //       country_id: this.responseAddData.country_id,
      //       zone_id: this.responseAddData.zone_id
      //     }

      //     //Now set the payment address
      //     this.addressProvider.addShippingAddress(this.params).subscribe(
      //       response => {

      //         this.responseshippingData = response;

      //         if (this.responseshippingData.status) {

      this.navCtrl.push(DeliveryMethodsPage, {
        payment_address_id: this.payment_address_id,
        shipping_address_id: this.shipping_address_id
      });

      //         }
      //         this.loadingProvider.dismiss();
      //       },
      //       err => console.error(err),
      //       () => {
      //       }
      //     );
      //   },
      //   err => console.error(err),
      //   () => {
      //     this.loadingProvider.dismiss();
      //   }
      // );
    }
  }
}
