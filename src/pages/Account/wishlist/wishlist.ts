import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { WishlistProvider } from '../../../providers/wishlist/wishlist';
import { LoginProvider } from '../../../providers/login/login';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import { AlertController, Alert } from 'ionic-angular';
import { HomePage } from '../../Main/home/home';
import { ProductDetailsPage } from '../../Products/product-details/product-details';
import { AlertProvider } from '../../../providers/alert/alert';

@IonicPage()
@Component({
  selector: 'page-wishlist',
  templateUrl: 'wishlist.html',
})
export class WishlistPage {

  public customer_id;
  public responseData;
  public status;
  public success;
  public products;
  public fromPage;
  public error_warning;
  public alert: Alert;

  public wish_empty_txt;
  public heading_title;
  public server_slow_txt;
  public oops_txt;
  public exit_app_txt;
  public continue_txt;
  public smthng_wrong;
  public ok_txt;
  public success_txt;
  public warning_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public loginProvider: LoginProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public alertProvider: AlertProvider,
    public languageProvider: LanguageProvider,
    public wishlistProvider: WishlistProvider,
    public alertCtrl: AlertController,
  ) {

    this.customer_id = this.loginProvider.customer_id;
    this.setText();
    // this.isLogin();
    this.getServerData();

    this.fromPage = this.navParams.get('from');

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });
  }

  setText() {

    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    console.log("getLanguage() : " + this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('wish_empty').subscribe((text: string) => {
      this.wish_empty_txt = text;
    });
    this.translate.get('wishlist').subscribe((text: string) => {
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
  }

  ionViewWillEnter() {
    this.isLogin();
  }

  isLogin() {
    this.customer_id = this.loginProvider.customer_id;
    if (!this.customer_id) {
      this.navCtrl.push(LoginPage);
    }
  }

  goBack() {
    if (this.fromPage == 'profile')
      this.navCtrl.pop();
    else
      this.navCtrl.setRoot(HomePage);
  }

  viewProductDetail(data: any) {
    this.navCtrl.push(ProductDetailsPage, { id: data.product_id });
  }

  remove(data: any) {

    this.loadingProvider.present();
    this.wishlistProvider.removeWishlist(data).subscribe(
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

  getServerData() {

    this.loadingProvider.present();
    this.wishlistProvider.getWishlist().subscribe(
      response => {
        this.responseData = response;
        this.status = this.responseData.status;

        if (this.status) {
          this.products = this.responseData.products;
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

}
