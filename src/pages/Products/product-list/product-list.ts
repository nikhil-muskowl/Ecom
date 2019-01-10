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
import { HomePage } from '../../Main/home/home';
import { CategoriesPage } from '../categories/categories';

@IonicPage()
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage {

  public rateValue;
  public filterData;

  language_id;
  currency_id;
  fromPage;
  public sorts;
  public limits;
  public pagination;
  public results;
  public search;
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

  isSearch = 0;
  searchInput;

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public categoryProvider: CategoryProvider,
    public platform: Platform,
    public settingsProvider: SettingsProvider,
    public actionSheetCtrl: ActionSheetController,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {
    this.id = navParams.get('id');

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.language_id = this.languageProvider.getLanguage();
    this.currency_id = this.settingsProvider.getCurrData();

    this.fromPage = this.navParams.data.from;
    this.country_origin_filter = this.navParams.data.countryOrigin;
    this.brands = this.navParams.data.brand;
    this.price = this.navParams.data.price;

    this.setText();
    this.getServerData();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    console.log("getLanguage() : " + this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('products_list').subscribe((text: string) => {
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

  getSearch() {
    if (this.isSearch == 0) {
      this.isSearch = 1;
    }
    else {
      this.isSearch = 0;
      this.searchInput = '';
    }
  }

  goBack() {
    if (this.fromPage == 'home' || this.fromPage == undefined) {
      this.navCtrl.setRoot(HomePage);
    }
    else {
      this.navCtrl.setRoot(CategoriesPage);
    }
  }

  getServerData() {
    this.filterData = {
      'search': this.search,
      'page': this.page,
      'sort': this.sort,
      'order': this.order,
      'category_filter': this.id,
      'language_id': this.language_id,
      'currency_id': this.currency_id,
      'country_origin_filter': this.country_origin_filter,
      'brand_filter': this.brands,
      'price_filter': this.price,
    };

    this.loadingProvider.show();
    this.categoryProvider.apiProductList(this.filterData).subscribe(
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
    let psrams = {
      countryOrigin: this.country_origin_filter,
      brand: this.brands,
      price: this.price,
      fromPage: "productList",
    };
    this.navCtrl.push(FiltersPage, psrams);
  }

  // presentLimitActionSheet() {
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'Limit of Products',
  //   });

  //   for (let index = 0; index < this.limits.length; index++) {
  //     var limitButtons = {
  //       text: this.limits[index].text,
  //       handler: () => {
  //         this.limit = this.limits[index].value;
  //         this.page = 1;
  //         this.productModel = [];
  //         this.getServerData();
  //       }
  //     };
  //     actionSheet.addButton(limitButtons);
  //   }
  //   actionSheet.present();
  // }

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

  public onSearch(ev: any) {
    this.search = ev.target.value;
    this.productModel = [];
    this.getServerData();
  }

  public onSearchCancel() {
    this.search = '';
  }
}
