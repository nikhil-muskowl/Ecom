import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ActionSheetController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { FiltersProvider } from '../../../providers/filters/filters';
import { SettingsProvider } from '../../../providers/settings/settings';
import { ProductListPage } from '../product-list/product-list';
import { SpecialOffersPage } from '../special-offers/special-offers';

@IonicPage()
@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html',
})
export class FiltersPage {

  language_id;
  currency_id;
  responseBrandData
  brands: any = [];
  brandsModal: any = [];
  selectedBrandsArray: any = [];

  responseCountryData;
  country_origins: any = [];
  country_originsModal: any = [];
  selectedArray: any = [];

  min_price: number;
  max_price: number;
  priceFilter;
  selectedPriceArray: any = [];

  fromPage;

  //txt
  heading_title;
  price_txt;
  country_origin_txt;
  brands_txt;
  apply_txt;
  clear_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public filtersProvider: FiltersProvider,
    public platform: Platform,
    public settingsProvider: SettingsProvider,
    public actionSheetCtrl: ActionSheetController,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {

    this.setText();
    this.fromPage = this.navParams.data.fromPage;
    //in IF condition because it through undefines and then 'push' error
    if (this.navParams.data.countryOrigin) {
      this.selectedArray = this.navParams.data.countryOrigin;
    }
    if (this.navParams.data.brand) {
      this.selectedBrandsArray = this.navParams.data.brand;
    }
    if (this.navParams.data.price) {
      this.selectedPriceArray = this.navParams.data.price;
    }

    console.log("this.selectedPriceArray : " + this.selectedPriceArray.length);
    this.language_id = this.languageProvider.getLanguage();
    this.currency_id = this.settingsProvider.getCurrData();

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.getServerData();
    this.getapiPricesData();
    this.getBrandData();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    console.log("getLanguage() : " + this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('filters').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('price').subscribe((text: string) => {
      this.price_txt = text;
    });
    this.translate.get('country_origin').subscribe((text: string) => {
      this.country_origin_txt = text;
    });
    this.translate.get('brands').subscribe((text: string) => {
      this.brands_txt = text;
    });
    this.translate.get('apply').subscribe((text: string) => {
      this.apply_txt = text;
    });
    this.translate.get('clear').subscribe((text: string) => {
      this.clear_txt = text;
    });

  }

  getServerData() {

    this.loadingProvider.show();
    this.filtersProvider.apiCountryOrigins().subscribe(
      response => {
        this.responseCountryData = response;
        if (this.responseCountryData.status) {
          this.country_origins = this.responseCountryData.country_origins;
          this.binddata();
        }
        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  getBrandData() {

    let param = {
      language_id: this.language_id,
      currency_id: this.currency_id
    };

    this.loadingProvider.show();
    this.filtersProvider.apiBrands(param).subscribe(
      response => {
        this.responseBrandData = response;
        if (this.responseBrandData.status) {
          this.brands = this.responseBrandData.manufacturers;
          this.bindBranddata();
        }
        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  getapiPricesData() {
    let param = {
      language_id: this.language_id,
      currency_id: this.currency_id
    };
    this.filtersProvider.apiprices(param).subscribe(
      response => {

        if (response.status) {
          this.min_price = response.price_range_min.toFixed();
          this.max_price = response.price_range_max.toFixed();
          if (this.selectedPriceArray.length > 0) {
            this.priceFilter = { lower: this.selectedPriceArray[0], upper: this.selectedPriceArray[1] };
          }
          else {
            this.priceFilter = { lower: this.min_price, upper: this.max_price };
          }
          console.log(this.min_price + " : " + this.max_price);
        }
      },
      err => console.error(err),
      () => {
      }
    );
  }

  goBack() {
    this.navCtrl.pop();
  }

  bindBranddata() {
    for (let index = 0; index < this.brands.length; index++) {
      if (this.selectedBrandsArray != undefined && this.selectedBrandsArray.indexOf(this.brands[index].manufacturer_id) >= 0) {
        this.brandsModal.push({
          manufacturer_id: this.brands[index].manufacturer_id,
          name: this.brands[index].name,
          checked: true,
        });
      }
      else {
        this.brandsModal.push({
          manufacturer_id: this.brands[index].manufacturer_id,
          name: this.brands[index].name,
          checked: false,
        });
      }
    }
  }

  binddata() {
    for (let index = 0; index < this.country_origins.length; index++) {
      if (this.selectedArray != undefined && this.selectedArray.indexOf(this.country_origins[index].country_origin_id) >= 0) {
        this.country_originsModal.push({
          country_origin_id: this.country_origins[index].country_origin_id,
          name: this.country_origins[index].name,
          checked: true,
        });
      }
      else {
        this.country_originsModal.push({
          country_origin_id: this.country_origins[index].country_origin_id,
          name: this.country_origins[index].name,
          checked: false,
        });
      }
    }
  }

  changePriceRange(data) {
    this.selectedPriceArray = [];
    console.log("Prices : " + JSON.stringify(data));
    this.selectedPriceArray.push(data.lower);
    this.selectedPriceArray.push(data.upper);
  }

  applyFilters() {
    console.log("Apply Brands : " + JSON.stringify(this.selectedBrandsArray));
    console.log("Apply Country : " + JSON.stringify(this.selectedArray));
    console.log("Apply Prices : " + JSON.stringify(this.selectedPriceArray));

    if (this.fromPage == 'productList') {
      this.navCtrl.push(ProductListPage, {
        countryOrigin: this.selectedArray,
        brand: this.selectedBrandsArray,
        price: this.selectedPriceArray
      });
    }
    if (this.fromPage == 'special') {
      this.navCtrl.push(SpecialOffersPage, {
        countryOrigin: this.selectedArray,
        brand: this.selectedBrandsArray,
        price: this.selectedPriceArray
      });
    }
  }

  clearFilters() {
    this.selectedArray = [];
    this.selectedBrandsArray = [];
    this.selectedPriceArray = [];

    this.country_originsModal = [];
    this.brandsModal = [];

    this.getServerData();
    // this.getapiPricesData();
    this.priceFilter = { lower: this.min_price, upper: this.max_price };
    this.getBrandData();
    this.selectedPriceArray = [];
  }

  selectMember(data, i) {

    console.log("select data : " + JSON.stringify(data));
    if (data.checked == true) {
      this.selectedArray.push(data.country_origin_id);
    } else {
      let index = this.selectedArray.indexOf(data.country_origin_id);
      console.log("index : " + index);
      this.selectedArray.splice(index, 1);
    }
    console.log(this.selectedArray);
  }

  selectedBrands(data, i) {
    console.log("select brand data : " + JSON.stringify(data));
    if (data.checked == true) {
      this.selectedBrandsArray.push(data.manufacturer_id);
    } else {
      let index = this.selectedBrandsArray.indexOf(data.manufacturer_id);
      console.log("index : " + index);
      this.selectedBrandsArray.splice(index, 1);

    }
    console.log(this.selectedBrandsArray);
  }
}
