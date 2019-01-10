import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoginProvider } from '../../../providers/login/login';
import { AlertController, Alert } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SettingsProvider } from '../../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  responseData;
  currencies;
  status;
  currency;

  responseLangData;
  languages;
  language;

  //txt
  heading_title;
  select_currency_txt;
  select_language_txt;
  ok_text;
  cancel_text;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public loginProvider: LoginProvider,
    public settingsProvider: SettingsProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
    public alertCtrl: AlertController,
  ) {
    this.currency = this.settingsProvider.getCurrData();
    this.language = this.languageProvider.getLanguage();

    this.setText();
    this.getCurrency();
    this.getLanguage();
    
    console.log("this.currency  : " + this.currency);

    platform.registerBackButtonAction(() => {
      this.goBack();
    });

  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('settings').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('select_currency').subscribe((text: string) => {
      this.select_currency_txt = text;
    });
    this.translate.get('select_language').subscribe((text: string) => {
      this.select_language_txt = text;
    });
    this.translate.get('ok').subscribe((text: string) => {
      this.ok_text = text;
    });
    this.translate.get('cancel').subscribe((text: string) => {
      this.cancel_text = text;
    });

  }

  getCurrency() {
    this.loadingProvider.present();

    this.settingsProvider.apigetCurrencies().subscribe(response => {
      this.responseData = response;
      this.currencies = this.responseData.currencies;
      this.loadingProvider.dismiss();
    }, err => {
      console.error(err);
    }
    );
    this.loadingProvider.dismiss();
  }

  getLanguage() {
    // this.loadingProvider.present();

    this.languageProvider.apigetLanguages().subscribe(response => {
      this.responseLangData = response;
      this.languages = this.responseLangData.languages;
      // this.loadingProvider.dismiss();
    }, err => {
      console.error(err);
    }
    );
    // this.loadingProvider.dismiss();
  }

  goBack() {
    this.navCtrl.setRoot(HomePage);
  }

  onCurrChange(data: any) {
    console.log('selected currency : ' + JSON.stringify(data));

    this.changeCurrency(data.code);
    this.settingsProvider.setCurrency(data.code);
    console.log(" Changed : " + this.settingsProvider.getCurrData());
  }

  onLangChange(data: any) {

    console.log('selected language : ' + JSON.stringify(data));
    this.changeLanguage(data.code);
    this.languageProvider.apiUserSetCurrencies(data.code);
    console.log(" Changed : " + this.settingsProvider.getCurrData());
  }

  changeCurrency(code) {
    this.loadingProvider.present();

    this.settingsProvider.apiUserSetCurrencies(code).subscribe(response => {

      this.responseData = response;
      this.status = this.responseData.status;
      if (status) {
        console.log("Currency Changed successfully");
      }
      this.loadingProvider.dismiss();
    }, err => {
      console.error(err);
    }
    );
    this.loadingProvider.dismiss();
  }

  changeLanguage(code) {
    this.loadingProvider.present();

    this.settingsProvider.apiUserSetCurrencies(code).subscribe(response => {

      this.responseData = response;
      this.status = this.responseData.status;
      if (status) {
        console.log("Currency Changed successfully");
      }
      this.loadingProvider.dismiss();
    }, err => {
      console.error(err);
    }
    );
    this.loadingProvider.dismiss();
  }
}
