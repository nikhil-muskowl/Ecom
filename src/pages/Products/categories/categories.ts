import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { CategoryProvider } from '../../../providers/category/category';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ProductListPage } from '../product-list/product-list';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { HomePage } from '../../Main/home/home';
import { SettingsProvider } from '../../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  heading_title;
  responseData;
  catList;
  language_id;
  currency_id;

  // Selected cat
  selectedCat: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public settingsProvider: SettingsProvider,
    public languageProvider: LanguageProvider,
    public translate: TranslateService,
    public categoryProvider: CategoryProvider,
    public loadingProvider: LoadingProvider,
  ) {

    this.language_id = this.languageProvider.getLanguage();
    this.currency_id = this.settingsProvider.getCurrData();

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });
    this.getCategory();
    this.setText();

  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('categories').subscribe((text: string) => {
      this.heading_title = text;
    });
  }

  goBack() {
    this.navCtrl.setRoot(HomePage);
  }

  getCategory() {
    this.loadingProvider.show();
    let param = {
      language_id: this.language_id,
      currency_id: this.currency_id,
    }

    this.categoryProvider.apiCategory(param).subscribe(
      response => {
        this.responseData = response;
        this.catList = this.responseData.categories;
        console.log("catList : " + JSON.stringify(this.catList));
        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  ExpandChild(items, i) {
    console.log("click on head : " + items.name);
    if (this.selectedCat) {
      this.selectedCat = 0;
    } else {
      this.selectedCat = i;
    }
  }

  openPage(data: any) {
    console.log("click on child : " + data.name);
    this.navCtrl.push(ProductListPage, { id: data.category_id, name: data.name });
  }
}
