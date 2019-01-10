import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CategoryProvider } from '../../../providers/category/category';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoginProvider } from '../../../providers/login/login';
import { CartProvider } from '../../../providers/cart/cart';
import { WishlistProvider } from '../../../providers/wishlist/wishlist';
import { AlertController, Alert } from 'ionic-angular';
import { CartPage } from '../../Orders/cart/cart';
import { WishlistPage } from '../../Account/wishlist/wishlist';
import { LoginPage } from '../../Account/login/login';
import { SettingsProvider } from '../../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})

export class ProductDetailsPage {
  public language_id;
  public currency_id;
  public customer_id;
  public product_id;
  public responseData;
  public success;
  public error_warning;
  public totalQty;
  public review_tab;
  public cart_quantity = 1;

  //response
  public heading_title;
  public description;
  public manufacturer;
  public country_origin;
  public model;
  public reward;
  public points;
  public stock;
  public price;
  public special;
  public images;
  public popup;
  public thumb;
  public tax;
  public discounts;
  public options;
  public review_status;
  public rating;

  submitAttempt;
  cartForm: FormGroup;
  private formData: any;

  //text
  public error_login;
  public qty_error;
  public field_error;
  public warning;
  public success_txt;
  public goto_cart;
  public ok_txt;
  public goto_wishlist;
  public goto_login;
  public description_txt;
  public reviews_txt;
  public add_to_wishlist;
  public add_to_cart;
  public quantity;
  public option;
  public available;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public settingsProvider: SettingsProvider,
    public formBuilder: FormBuilder,
    public categoryProvider: CategoryProvider,
    public alertProvider: AlertProvider,
    private alertCtrl: AlertController,
    public loadingProvider: LoadingProvider,
    public loginProvider: LoginProvider,
    public cartProvider: CartProvider,
    public wishlistProvider: WishlistProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {

    this.language_id = this.languageProvider.getLanguage();
    this.currency_id = this.settingsProvider.getCurrData();
    this.customer_id = this.loginProvider.getData();
    this.product_id = this.navParams.get("id");
    console.log("Product id : " + this.product_id);
    this.createForm();
    this.setText();
    this.getProductDetails();

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    console.log("getLanguage() : " + this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('error_login').subscribe((text: string) => {
      this.error_login = text;
    });
    this.translate.get('warning').subscribe((text: string) => {
      this.warning = text;
    });
    this.translate.get('success').subscribe((text: string) => {
      this.success_txt = text;
    });
    this.translate.get('goto_cart').subscribe((text: string) => {
      this.goto_cart = text;
    });
    this.translate.get('ok').subscribe((text: string) => {
      this.ok_txt = text;
    });
    this.translate.get('goto_wishlist').subscribe((text: string) => {
      this.goto_wishlist = text;
    });
    this.translate.get('goto_login').subscribe((text: string) => {
      this.goto_login = text;
    });
    this.translate.get('error_qty').subscribe((text: string) => {
      this.qty_error = text;
    });
    this.translate.get('field_error').subscribe((text: string) => {
      this.field_error = text;
    });
    this.translate.get('description').subscribe((text: string) => {
      this.description_txt = text;
    });
    this.translate.get('reviews').subscribe((text: string) => {
      this.reviews_txt = text;
    });
    this.translate.get('add_to_wishlist').subscribe((text: string) => {
      this.add_to_wishlist = text;
    });
    this.translate.get('add_to_cart').subscribe((text: string) => {
      this.add_to_cart = text;
    });
    this.translate.get('quantity').subscribe((text: string) => {
      this.quantity = text;
    });
    this.translate.get('option').subscribe((text: string) => {
      this.option = text;
    });
    this.translate.get('available').subscribe((text: string) => {
      this.available = text;
    });
  }

  ionViewWillEnter() {
    this.review_tab = 'description';
    this.platform.ready().then(() => {
      this.getProducts();
    })
  }

  createForm() {
    this.cartForm = this.formBuilder.group({
      // detail_id: ['', Validators.required],
      quantity: ['', Validators.required],
    });
  }

  getProductDetails() {
    this.loadingProvider.show();
    this.categoryProvider.apiProductDetails(this.product_id).subscribe(
      response => {
        this.responseData = response;

        this.heading_title = this.responseData.heading_title;
        this.description = this.categoryProvider.decodeEntities(this.responseData.description);
        this.manufacturer = this.responseData.manufacturer;
        this.country_origin = this.responseData.country_origin;
        this.model = this.responseData.model;
        this.reward = this.responseData.reward;
        this.points = this.responseData.points;
        this.stock = this.responseData.stock;
        this.price = this.responseData.price;
        this.special = this.responseData.special;
        this.popup = this.responseData.popup;
        this.thumb = this.responseData.thumb;
        this.tax = this.responseData.tax;
        this.images = this.responseData.images;
        this.discounts = this.responseData.discounts;
        this.options = this.responseData.options;
        this.review_status = this.responseData.review_status;
        this.rating = this.responseData.rating;
        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  save() {
    if (!this.customer_id) {
      // this.error_login = "Please login first";
      this.alertProvider.title = this.warning;
      this.alertProvider.message = this.error_login;
      this.showMessage();
      this.submitAttempt = false;
    } else {
      this.submitAttempt = true;

      if (this.cartForm.valid) {
        this.formData = {
          quantity: this.cartForm.value.quantity,
          customer_id: this.customer_id,
          // detail_id: this.cartForm.value.detail_id,
          product_id: Number(this.product_id)
        };
        this.loadingProvider.present();
        this.cartProvider.add(this.formData).subscribe(
          response => {
            this.responseData = response;
            this.submitAttempt = true;

            if (this.responseData.success && this.responseData.success != '') {
              this.success = this.responseData.success;
              this.alertProvider.title = this.success_txt;
              this.alertProvider.message = this.success;
              this.showConfirm();
              this.getProducts();
              this.submitAttempt = false;
            }

            if (this.responseData.error && this.responseData.error != '') {
              this.error_warning = this.responseData.error;
              this.alertProvider.title = this.warning;
              this.alertProvider.message = this.error_warning;
              this.alertProvider.showAlert();
              this.submitAttempt = false;
            }
          },
          err => console.error(err),
          () => {
            this.loadingProvider.dismiss();
          }
        );
      }
    }
  }

  addWishlist() {
    if (!this.customer_id) {
      // this.error_login = "Please login first";
      this.alertProvider.title = this.warning;
      this.alertProvider.message = this.error_login;
      this.showMessage();
      this.submitAttempt = false;
    } else {
      this.submitAttempt = true;

      if (this.cartForm.valid) {
        this.formData = {
          // quantity: this.cartForm.value.quantity,
          // detail_id: this.cartForm.value.detail_id,
          customer_id: this.customer_id,
          product_id: Number(this.product_id)
        };
        this.loadingProvider.present();
        this.wishlistProvider.addWishlist(this.formData).subscribe(response => {
          // console.log(response);
          this.responseData = response;
          this.submitAttempt = true;

          if (this.responseData.success && this.responseData.success != '') {
            this.success = this.responseData.success;
            this.alertProvider.title = this.success;
            this.alertProvider.message = this.success;
            this.showConfirmWishlist();
            this.submitAttempt = false;
          }

          if (this.responseData.error && this.responseData.error != '') {
            this.error_warning = this.responseData.error;
            this.alertProvider.title = this.warning;
            this.alertProvider.message = this.error_warning;
            this.alertProvider.showAlert();
            this.submitAttempt = false;
          }
        },
          err => console.error(err),
          () => {
            this.loadingProvider.dismiss();
          }
        );
      }
    }
  }

  getProducts() {
    let param = {
      language_id: this.language_id,
      currency_id: this.currency_id
    };
    this.loadingProvider.present();
    this.cartProvider.products(param).subscribe(
      response => {
        if (response) {
          if (response.total_quantity) {
            this.totalQty = response.total_quantity;
          }
        }
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
    return event;
  }

  goTocart() {
    this.navCtrl.push(CartPage);
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: this.success_txt,
      message: this.success,
      buttons: [
        {
          text: this.ok_txt,
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: this.goto_cart,
          handler: () => {
            //console.log('Agree clicked');
            //this.navcontroller.setRoot(CartPage);
            this.navCtrl.push(CartPage);
          }
        }
      ]
    });
    confirm.present();
  }

  showConfirmWishlist() {
    let confirm = this.alertCtrl.create({
      title: this.success,
      message: this.success,
      buttons: [
        {
          text: this.ok_txt,
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: this.goto_wishlist,
          handler: () => {
            //console.log('Agree clicked');
            //this.navcontroller.setRoot(CartPage);
            this.navCtrl.push(WishlistPage);
          }
        }
      ]
    });
    confirm.present();
  }

  showMessage() {
    let confirm = this.alertCtrl.create({
      title: this.warning,
      message: this.error_login,
      buttons: [
        {
          text: this.ok_txt,
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: this.goto_login,
          handler: () => {
            //console.log('Agree clicked');
            //this.navcontroller.setRoot(CartPage);
            this.navCtrl.push(LoginPage);
          }
        }
      ]
    });
    confirm.present();
  }
}
