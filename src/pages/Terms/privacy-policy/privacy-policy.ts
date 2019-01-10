import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Modal } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoginProvider } from '../../../providers/login/login';
import { CartProvider } from '../../../providers/cart/cart';
import { ModalProvider } from '../../../providers/modal/modal';

@IonicPage()
@Component({
  selector: 'page-privacy-policy',
  templateUrl: 'privacy-policy.html',
})
export class PrivacyPolicyPage {

  //txt
  public heading_title;
  public cancel;

  public policies;
  private responseData;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public loginProvider: LoginProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
    public cartProvider: CartProvider,
    public modalProvider: ModalProvider,
  ) {

    this.setText();
    this.getPolicy();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('privacy_policy').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('cancel').subscribe((text: string) => {
      this.cancel = text;
    });
  }

  public getPolicy() {
    this.loadingProvider.present();
    // Use another API for policy in cart provider
    this.cartProvider.getTermCondition().subscribe(
      response => {
        if (response) {
          // console.log(response);
          this.responseData = response;
          this.policies = this.responseData.terms;
        }
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
    return event;
  }

  dismiss() {
    this.modalProvider.dismiss();
  }
}
