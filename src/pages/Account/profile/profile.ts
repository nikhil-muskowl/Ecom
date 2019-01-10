import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ScrollHideConfig } from '../../../directives/scroll-hide/scroll-hide';
import { AlertController, Alert } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoginProvider } from '../../../providers/login/login';
import { LoginPage } from '../login/login';
import { HomePage } from '../../Main/home/home';
import { WishlistPage } from '../wishlist/wishlist';
import { OrderPage } from '../../Orders/order/order';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ChangePasswordPage } from '../change-password/change-password';
import { AddressesPage } from '../addresses/addresses';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 60 };

  public heading_title;
  public customerFname;
  public customerLname;
  public email;
  public telephone;
  public success;
  public responseData;

  public totalQty = 0;
  public alert: Alert;

  public user_id;
  //txt
  public acc_setting_txt;
  public wishlist_txt;
  public my_orders_txt;
  public my_requests_txt;
  public edit_acc_txt;
  public chang_pass_txt;
  public logout_txt;
  public cancel_txt;
  public ok_txt;
  public yes_txt;
  public continue_txt;
  public confirm_logout;
  public want_to_logout;
  public server_slow_txt;
  public oops_txt;
  public exit_app_txt;
  public smthng_wrong;
  public address_book_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public alertCtrl: AlertController,
    public loginProvider: LoginProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.setText();
    // this.isLogin();
    platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(HomePage);
    });
  }

  ionViewWillEnter() {
    this.isLogin();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('my_acc').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('acc_setting').subscribe((text: string) => {
      this.acc_setting_txt = text;
    });
    this.translate.get('wishlist').subscribe((text: string) => {
      this.wishlist_txt = text;
    });
    this.translate.get('my_orders').subscribe((text: string) => {
      this.my_orders_txt = text;
    });
    this.translate.get('my_requests').subscribe((text: string) => {
      this.my_requests_txt = text;
    });
    this.translate.get('edit_acc').subscribe((text: string) => {
      this.edit_acc_txt = text;
    });
    this.translate.get('chang_pass').subscribe((text: string) => {
      this.chang_pass_txt = text;
    });
    this.translate.get('logout').subscribe((text: string) => {
      this.logout_txt = text;
    });
    this.translate.get('ok').subscribe((text: string) => {
      this.ok_txt = text;
    });
    this.translate.get('cancel').subscribe((text: string) => {
      this.cancel_txt = text;
    });
    this.translate.get('continue').subscribe((text: string) => {
      this.continue_txt = text;
    });
    this.translate.get('confirm_logout').subscribe((text: string) => {
      this.confirm_logout = text;
    });
    this.translate.get('want_to_logout').subscribe((text: string) => {
      this.want_to_logout = text;
    });
    this.translate.get('yes').subscribe((text: string) => {
      this.yes_txt = text;
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
    this.translate.get('smthng_wrong').subscribe((text: string) => {
      this.smthng_wrong = text;
    });
    this.translate.get('address_book').subscribe((text: string) => {
      this.address_book_txt = text;
    });

  }

  isLogin() {
    this.user_id = this.loginProvider.getData();
    if (!this.user_id) {
      this.navCtrl.setRoot(LoginPage);
    } else {
      this.getProfile();
    }
  }

  getProfile() {
    this.loginProvider.apiProfile().subscribe(response => {
      if (response) {
        this.responseData = response;

        this.success = this.responseData.success;
        if (this.success == 'Success') {
          this.customerFname = this.responseData.firstname;
          this.customerLname = this.responseData.lastname;
          this.email = this.responseData.email;
          this.telephone = this.responseData.telephone;
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
                  this.getProfile();
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
      }
    );
  }

  logout() {
    let alert = this.alertCtrl.create({
      title: this.confirm_logout,
      message: this.want_to_logout,
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
            this.loginProvider.logout();
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();

  }

  gotoWishlist() {
    this.navCtrl.push(WishlistPage, { from: 'profile' });
  }

  gotoAddress() {
    this.navCtrl.push(AddressesPage);
  }

  gotoOrders() {
    this.navCtrl.push(OrderPage);
  }

  gotoEditAccount() {
    let param = {
      firstname: this.customerFname,
      lastname: this.customerLname,
      email: this.email,
      telephone: this.telephone,
    };
    this.navCtrl.push(EditProfilePage, param);
  }

  gotoChangePassword() {
    this.navCtrl.push(ChangePasswordPage);
  }
}
