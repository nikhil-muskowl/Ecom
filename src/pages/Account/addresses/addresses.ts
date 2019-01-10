import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { AddressProvider } from '../../../providers/address/address';
import { LoginProvider } from '../../../providers/login/login';
import { AlertController, Alert } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert/alert';
import { ProfilePage } from '../profile/profile';
import { AddAddressPage } from '../add-address/add-address';
import { ModalProvider } from '../../../providers/modal/modal';
import { EditAddressPage } from '../edit-address/edit-address';


@IonicPage()
@Component({
  selector: 'page-addresses',
  templateUrl: 'addresses.html',
})
export class AddressesPage {

  public responseData;
  public status;
  public success;
  public addresses: any = [];
  public error_warning;
  public alert: Alert;

  public address_empty_txt;
  public heading_title;
  public server_slow_txt;
  public oops_txt;
  public exit_app_txt;
  public continue_txt;
  public smthng_wrong;
  public ok_txt;
  public success_txt;
  public warning_txt;
  public add_new_address_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public modalProvider: ModalProvider,
    public loginProvider: LoginProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public alertProvider: AlertProvider,
    public languageProvider: LanguageProvider,
    public addressProvider: AddressProvider,
    public alertCtrl: AlertController,
  ) {
    this.setText();
    // this.isLogin();
    this.getServerData();

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });
  }

  setText() {

    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    console.log("getLanguage() : " + this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('addresses_empty').subscribe((text: string) => {
      this.address_empty_txt = text;
    });
    this.translate.get('address_book').subscribe((text: string) => {
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
    this.translate.get('success').subscribe((text: string) => {
      this.success_txt = text;
    });
    this.translate.get('warning').subscribe((text: string) => {
      this.warning_txt = text;
    });
    this.translate.get('add_new_address').subscribe((text: string) => {
      this.add_new_address_txt = text;
    });
  }

  goBack() {
    this.navCtrl.setRoot(ProfilePage);
  }

  remove(address) {
    this.loadingProvider.present();
    this.addressProvider.removeAddress(address).subscribe(
      response => {
        this.responseData = response;

        if (this.responseData.success && this.responseData.success != '') {
          this.success = this.responseData.success;
          this.alertProvider.title = this.success_txt;
          this.alertProvider.message = this.success;
          this.alertProvider.showAlert();
          this.getServerData();
        }

        this.loadingProvider.dismiss();

        if (this.responseData.error && this.responseData.error != '') {
          this.error_warning = this.responseData.error;

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

  edit(address) {
    let param = { address_id: address.address_id };
    this.modalProvider.presentProfileModal(EditAddressPage, param);

    this.modalProvider.modal.onDidDismiss(data => {
      // This is added to refresh page.
      // this.navCtrl.push(this.navCtrl.getActive().component);
      this.getServerData();
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
}
