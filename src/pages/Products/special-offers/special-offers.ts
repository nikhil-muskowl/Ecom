import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { CategoryProvider } from '../../../providers/category/category';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ProductDetailsPage } from '../product-details/product-details';
import { ActionSheetController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { FiltersPage } from '../filters/filters';
import { SettingsProvider } from '../../../providers/settings/settings';
import { LoginProvider } from '../../../providers/login/login';
import { HomePage } from '../../Main/home/home';


@IonicPage()
@Component({
  selector: 'page-special-offers',
  templateUrl: 'special-offers.html',
})
export class SpecialOffersPage {

  public rateValue;
  public filterData;

  language_id;
  currency_id;

  public sorts;
  public limits;
  public pagination;
  public results;
  public sort;
  public order;
  public limit;
  public page = 1;
  public finalPage = 1;

  public id;
  public heading_title;
  public responseData;
  public products;
  public productModel: any[] = [];
  public isInfinite = true;

  //for params
  public country_origin_filter: any[] = [];;
  public brands: any[] = [];;
  public price: any[] = [];;

  //txt
  sort_products;
  load_more;
  sort_txt;
  filter_txt;
  search_place;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public categoryProvider: CategoryProvider,
    public platform: Platform,
    public settingsProvider: SettingsProvider,
    public actionSheetCtrl: ActionSheetController,
    public loadingProvider: LoadingProvider,
    public loginProvider: LoginProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {
    this.id = navParams.get('id');

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.language_id = this.languageProvider.getLanguage();
    this.currency_id = this.settingsProvider.getCurrData();

    this.country_origin_filter = this.navParams.data.countryOrigin;
    this.brands = this.navParams.data.brand;
    this.price = this.navParams.data.price;
    console.log(" this.country_origin_filter : " + this.country_origin_filter);
    console.log(" this.brands : " + this.brands);
    console.log(" this.price : " + this.price);

    this.setText();
    this.getServerData();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    console.log("getLanguage() : " + this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('special_offers').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('search_products').subscribe((text: string) => {
      this.search_place = text;
    });
    this.translate.get('sort_products').subscribe((text: string) => {
      this.sort_products = text;
    });
    this.translate.get('sort').subscribe((text: string) => {
      this.sort_txt = text;
    });
    this.translate.get('filter').subscribe((text: string) => {
      this.filter_txt = text;
    });
  }

  goBack() {
    this.navCtrl.setRoot(HomePage);
  }

  presentSortActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.sort_products,
    });

    for (let index = 0; index < this.sorts.length; index++) {

      var sortsButtons = {
        text: this.categoryProvider.decodeEntities(this.sorts[index].text),
        handler: () => {
          this.sort = this.sorts[index].value;
          let sortArray = this.sort.split("-");
          this.sort = sortArray[0];
          this.order = sortArray[1];

          this.productModel = [];
          this.getServerData();
        }
      };
      actionSheet.addButton(sortsButtons);
    }
    actionSheet.present();
  }

  openFilter() {
    let params = {
      countryOrigin: this.country_origin_filter,
      brand: this.brands,
      price: this.price,
      fromPage: "special",
    };
    this.navCtrl.push(FiltersPage, params);
  }

  getServerData() {
    this.filterData = {
      'page': this.page,
      'sort': this.sort,
      'order': this.order,
      'category_filter': this.id,
      'language_id': this.language_id,
      'currency_id': this.currency_id,
      'customer_id': this.loginProvider.customer_id,
      'country_origin_filter': this.country_origin_filter,
      'brand_filter': this.brands,
      'price_filter': this.price,
    };

    this.loadingProvider.show();
    this.categoryProvider.apispecialOffer(this.filterData).subscribe(
      response => {
        this.responseData = response;
        this.products = this.responseData.products;
        this.pagination = this.responseData.pagination;
        this.sorts = this.responseData.sorts;
        this.limits = this.responseData.limits;
        this.binddata();
        console.log("catList : " + JSON.stringify(this.products));
        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  binddata() {
    for (let index = 0; index < this.products.length; index++) {
      this.productModel.push({
        product_id: this.products[index].product_id,
        thumb: this.products[index].thumb,
        name: this.products[index].name,
        description: this.products[index].description,
        price: this.products[index].price,
        special: this.products[index].special,
        tax: this.products[index].tax,
        // discountrate: this.products[index].discountrate,
        // offerimage: this.products[index].offerimage,
        // vegsignimage: this.products[index].vegsignimage,
        minimum: this.products[index].minimum,
        rating: this.products[index].rating
      });
    }
  }

  onRateChange(rate) {
    this.rateValue = 0;
    this.rateValue = parseFloat(rate);
  }

  getProductDetail(product) {
    this.navCtrl.push(ProductDetailsPage, { id: product.product_id });
  }

  doInfinite(infiniteScroll) {

    if (this.pagination.length > 0) {
      this.pagination.forEach(element => {
        this.finalPage = element;
      });
    }

    if (this.page != this.finalPage) {
      this.page++;
      this.getServerData();
      this.isInfinite = true;
      setTimeout(() => {
        infiniteScroll.complete();
      }, 500);
    } else {
      this.isInfinite = false;
    }
  }
}
