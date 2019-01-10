import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoginProvider } from '../../../providers/login/login';
import { AlertController, Alert } from 'ionic-angular';
import { SettingsProvider } from '../../../providers/settings/settings';
import { HomeProvider } from '../../../providers/home/home';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) banSlides: Slides;
  @ViewChild(Slides) featuredSlides: Slides;
  @ViewChild(Slides) leatestSlides: Slides;
  @ViewChild(Slides) sellerSlides: Slides;

  heading_title;
  public language_id;
  public currency_id;
  //Banners
  responseBanenerData;
  BannerData: any = [];

  //Featured
  responseFeaturedData;
  FeaturedData: any = [];

  //Leatest
  responseLeatestData;
  LeatestData: any = [];

  //Best Seller
  responseSellerData;
  SellerData: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public homeProvider: HomeProvider,
    public settingsProvider: SettingsProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public loginProvider: LoginProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
    public alertCtrl: AlertController, ) {

    this.language_id = this.languageProvider.getLanguage();
    this.currency_id = this.settingsProvider.getCurrData();

    this.setText();
    this.getBanners();
    this.getFeatured();
    this.getLeatest();
    this.getBestseller();

  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('ecom').subscribe((text: string) => {
      this.heading_title = text;
    });
  }

  public getBanners() {
    let param = {
      language_id: this.language_id,
      currency_id: this.currency_id,
      banner_id: '7',
    };
    this.homeProvider.apiBannerDetails(param).subscribe(
      response => {
        this.responseBanenerData = response;

        if (this.responseBanenerData.status) {
          this.BannerData = this.responseBanenerData.banners;
        }
      },
      err => console.error(err),
      () => {
      }
    );
  }

  slideBannerChanged() {
    let currentIndex = this.banSlides.getActiveIndex();
    if (currentIndex == this.BannerData.length) {
      this.banSlides.stopAutoplay();

    }
  }

  public getFeatured() {
    let param = {
      language_id: this.language_id,
      currency_id: this.currency_id,
      banner_id: '7',
    };
    this.homeProvider.apiFeatured(param).subscribe(
      response => {
        this.responseFeaturedData = response;

        if (this.responseFeaturedData.status) {
          this.FeaturedData = this.responseFeaturedData.products;
        }
      },
      err => console.error(err),
      () => {
      }
    );
  }

  slideFeaturedChanged() {
    let currentIndex = this.featuredSlides.getActiveIndex();
    if (currentIndex == this.FeaturedData.length) {
      this.featuredSlides.stopAutoplay();

    }
  }

  public getLeatest() {
    let param = {
      language_id: this.language_id,
      currency_id: this.currency_id,
    };

    this.homeProvider.apiLatest(param).subscribe(
      response => {
        this.responseLeatestData = response;

        if (this.responseLeatestData.status) {
          this.LeatestData = this.responseLeatestData.products;
        }
      },
      err => console.error(err),
      () => {
      }
    );
  }

  slideLeatestChanged() {
    let currentIndex = this.leatestSlides.getActiveIndex();
    if (currentIndex == this.LeatestData.length) {
      this.leatestSlides.stopAutoplay();
    }
  }

  public getBestseller() {
    let param = {
      language_id: this.language_id,
      currency_id: this.currency_id,
    };

    this.homeProvider.apiBestseller(param).subscribe(
      response => {
        this.responseSellerData = response;

        if (this.responseSellerData.status) {
          this.SellerData = this.responseSellerData.products;
        }
      },
      err => console.error(err),
      () => {
      }
    );
  }

  slideBestsellerChanged() {
    let currentIndex = this.sellerSlides.getActiveIndex();
    if (currentIndex == this.LeatestData.length) {
      this.sellerSlides.stopAutoplay();
    }
  }
}