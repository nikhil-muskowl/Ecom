import { Component, Input } from '@angular/core';
import { CategoryProvider } from '../../providers/category/category';
import { LoadingProvider } from '../../providers/loading/loading';
import { AlertProvider } from '../../providers/alert/alert';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../providers/language/language';
import { SettingsProvider } from '../../providers/settings/settings';

@Component({
  selector: 'product-review',
  templateUrl: 'product-review.html'
})
export class ProductReviewComponent {
  @Input('productid') product_id: string;

  text: string;
  public reviews;
  public pagination;
  public results;
  public language_id;
  public currency_id;

  public rateValue;

  submitAttempt;
  reviewForm: FormGroup;
  public formData: any;
  public status;
  public message;
  public responseData;
  public error_name;
  public error_review;
  public error_rate;
  public success;
  public error;

  //txt
  public no_reviews;
  public write_review;
  public name_txt;
  public write_review_here;
  public post;
  public warning_txt;
  public success_txt;

  constructor(public formBuilder: FormBuilder,
    public categoryProvider: CategoryProvider,
    public loadingProvider: LoadingProvider,
    public alertProvider: AlertProvider,
    public settingsProvider: SettingsProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {


    this.setText();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    console.log("getLanguage() : " + this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('no_reviews').subscribe((text: string) => {
      this.no_reviews = text;
    });
    this.translate.get('write_review').subscribe((text: string) => {
      this.write_review = text;
    });
    this.translate.get('name').subscribe((text: string) => {
      this.name_txt = text;
    });
    this.translate.get('error_name').subscribe((text: string) => {
      this.error_name = text;
    });
    this.translate.get('error_review').subscribe((text: string) => {
      this.error_review = text;
    });
    this.translate.get('error_rate').subscribe((text: string) => {
      this.error_rate = text;
    });
    this.translate.get('write_review_here').subscribe((text: string) => {
      this.write_review_here = text;
    });
    this.translate.get('warning').subscribe((text: string) => {
      this.warning_txt = text;
    });
    this.translate.get('post').subscribe((text: string) => {
      this.post = text;
    });
  }

  ngOnChanges() {
    // console.log(this.product_id);  

    this.language_id = this.languageProvider.getLanguage();
    this.currency_id = this.settingsProvider.getCurrData();

    this.getServerData(this.product_id);
    this.createForm();
  }

  public getServerData(product_id) {
    this.loadingProvider.present();
    let param = {
      language_id: this.language_id,
      currency_id: this.currency_id,
    }
    this.categoryProvider.getReviews(param, product_id).subscribe(
      response => {
        // console.log(response);
        this.reviews = response.reviews;
        this.pagination = response.pagination;
        this.results = response.results;
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
    return event;
  }

  public createForm() {
    this.reviewForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(32), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      text: ['', Validators.required],
      rating: ['', Validators.required]
    });

  }

  public onRateChange(rate) {
    this.rateValue = rate;
  }

  public save() {
    this.submitAttempt = true;
    this.formData = this.reviewForm.valid;

    if (this.reviewForm.valid) {

      this.loadingProvider.present();

      this.categoryProvider.postReviews(this.product_id, this.reviewForm.value).subscribe(
        response => {
          this.responseData = response;
          console.log(JSON.stringify(this.responseData));
          this.submitAttempt = true;

          if (this.responseData.success && this.responseData.success != '') {
            this.success = this.responseData.success;
            this.alertProvider.title = this.success_txt;
            this.alertProvider.message = this.success;
            this.alertProvider.showAlert();
            this.reviewForm.reset();
            this.submitAttempt = false;
            this.getServerData(this.product_id);
          }

          if (this.responseData.error && this.responseData.error != '') {
            this.error = this.responseData.error;

            this.alertProvider.title = this.warning_txt;
            this.alertProvider.message = this.error;
            this.alertProvider.showAlert();
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
