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
  selector: 'page-terms-and-condition',
  templateUrl: 'terms-and-condition.html',
})
export class TermsAndConditionPage {

  //txt
  public heading_title;
  public cancel;

  public terms;
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
    this.getTerms();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('terms_and_conditions').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('cancel').subscribe((text: string) => {
      this.cancel = text;
    });
  }

  public getTerms() {
    this.loadingProvider.present();
    this.cartProvider.getTermCondition().subscribe(
      response => {
        if (response) {
          this.responseData = response;
          this.terms = this.responseData.terms;
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
