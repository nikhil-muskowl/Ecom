import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertProvider } from '../../../providers/alert/alert';
import { AlertController, Alert } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoginProvider } from '../../../providers/login/login';
import { AddressProvider } from '../../../providers/address/address';
import { ModalProvider } from '../../../providers/modal/modal';

@IonicPage()
@Component({
  selector: 'page-add-address',
  templateUrl: 'add-address.html',
})
export class AddAddressPage {
  public customer_id;
  public fname;
  public lname;
  public countries: any = [];
  public zones: any = [];
  public alert: Alert;
  public zoneResponse;
  public zoneData;

  //txt
  public heading_title;
  public firstname_txt;
  public lastname_txt;
  public address_txt;
  public address2_txt;
  public zone_txt;
  public postcode_txt;
  public city_txt;
  public continue_txt;
  public country_txt;
  public save_txt;
  public cancel_txt;
  public ok_txt;
  public yes_txt;
  public confirm_logout;
  public want_to_logout;
  public server_slow_txt;
  public oops_txt;
  public exit_app_txt;
  public smthng_wrong;
  public error_txt;
  public success_txt;

  // form fields  
  private address;
  private postcode;
  private city;
  private country_id = 1;
  private zone_id = 1;

  // errors
  private error_firstname;
  private error_lastname;
  private field_error;
  private error_address;
  private error_country_id;
  private error_zone_id;
  private error_postcode;
  private error_city;

  private success;
  private error_warning;

  // form data
  submitAttempt;
  addressForm: FormGroup;
  private formData: any;
  private status;
  private message;
  private responseData;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public platform: Platform,
    public modalProvider: ModalProvider,
    public addressProvider: AddressProvider,
    public alertProvider: AlertProvider,
    public alertCtrl: AlertController,
    public loadingProvider: LoadingProvider,
    public loginProvider: LoginProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.createForm();

    platform.registerBackButtonAction(() => {
      this.goBack();
    });
    this.getCountry();
    this.getZone(this.country_id);
    this.setText();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('add_address').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('firstname').subscribe((text: string) => {
      this.firstname_txt = text;
    });
    this.translate.get('lastname').subscribe((text: string) => {
      this.lastname_txt = text;
    });
    this.translate.get('address').subscribe((text: string) => {
      this.address_txt = text;
    });
    this.translate.get('address2').subscribe((text: string) => {
      this.address2_txt = text;
    });
    this.translate.get('zone').subscribe((text: string) => {
      this.zone_txt = text;
    });
    this.translate.get('postcode').subscribe((text: string) => {
      this.postcode_txt = text;
    });
    this.translate.get('city').subscribe((text: string) => {
      this.city_txt = text;
    });
    this.translate.get('error_firstname').subscribe((text: string) => {
      this.error_firstname = text;
    });
    this.translate.get('error_lastname').subscribe((text: string) => {
      this.error_lastname = text;
    });
    this.translate.get('field_error').subscribe((text: string) => {
      this.field_error = text;
    });
    this.translate.get('error_address').subscribe((text: string) => {
      this.error_address = text;
    });
    this.translate.get('error_zone').subscribe((text: string) => {
      this.error_zone_id = text;
    });
    this.translate.get('error_country').subscribe((text: string) => {
      this.error_country_id = text;
    });
    this.translate.get('error_postcode').subscribe((text: string) => {
      this.error_postcode = text;
    });
    this.translate.get('error_city').subscribe((text: string) => {
      this.error_city = text;
    });
    this.translate.get('country').subscribe((text: string) => {
      this.country_txt = text;
    });
    this.translate.get('save').subscribe((text: string) => {
      this.save_txt = text;
    });
    this.translate.get('ok').subscribe((text: string) => {
      this.ok_txt = text;
    });
    this.translate.get('cancel').subscribe((text: string) => {
      this.cancel_txt = text;
    });
    this.translate.get('success').subscribe((text: string) => {
      this.success_txt = text;
    });
    this.translate.get('continue').subscribe((text: string) => {
      this.continue_txt = text;
    });
    this.translate.get('confirm_logout').subscribe((text: string) => {
      this.confirm_logout = text;
    });
    this.translate.get('want_to_logout').subscribe((text: string) => {
      this.want_to_logout = text;
    });
    this.translate.get('yes').subscribe((text: string) => {
      this.yes_txt = text;
    });
    this.translate.get('server_slow').subscribe((text: string) => {
      this.server_slow_txt = text;
    });
    this.translate.get('oops').subscribe((text: string) => {
      this.oops_txt = text;
    });
    this.translate.get('exit_app').subscribe((text: string) => {
      this.exit_app_txt = text;
    });
    this.translate.get('smthng_wrong').subscribe((text: string) => {
      this.smthng_wrong = text;
    });
    this.translate.get('error').subscribe((text: string) => {
      this.error_txt = text;
    });
  }

  createForm() {
    this.addressForm = this.formBuilder.group({
      firstname: [this.fname, Validators.required],
      lastname: [this.lname, Validators.required],
      address: ['', Validators.required],
      address2: ['', ''],
      postcode: ['', Validators.required],
      city: ['', Validators.required],
      country_id: ['', Validators.required],
      zone_id: ['', Validators.required],
    });
  }

  goBack() {
    this.modalProvider.dismiss();
  }

  save() {
    this.submitAttempt = true;
    if (this.addressForm.valid) {
      this.loadingProvider.present();

      this.formData = this.addressForm.valid;

      this.addressProvider.addAddress(this.addressForm.value).subscribe(
        response => {
          this.responseData = response;

          this.submitAttempt = true;
          console.log("response register : " + JSON.stringify(this.responseData));

          if (this.responseData.status) {
            this.addressForm.reset();
            this.submitAttempt = false;

            this.alert = this.alertCtrl.create({
              title: this.success_txt,
              message: this.responseData.success,
              buttons: [
                {
                  text: this.continue_txt,
                  handler: () => {
                    this.goBack();
                  }
                }
              ]
            });
            this.alert.present();
          }

          if (!this.responseData.status) {
            this.alertProvider.title = this.error_txt;
            this.alertProvider.message = this.smthng_wrong;
            this.alertProvider.showAlert();
          }

        },
        err => {
          console.error(err);
          this.loadingProvider.dismiss();
        },
        () => {
          this.loadingProvider.dismiss();
        }
      );
    }
  }

  public getCountry() {
    //this.loadingProvider.present();
    this.addressProvider.getCountry().subscribe(
      response => {
        this.countries = response.countries;
      },
      err => console.error(err),
      () => {
        // this.loadingProvider.dismiss();
      }
    );
    return event;
  }

  public getZone(country_id) {
    this.country_id = country_id;
    // this.loadingProvider.present();
    this.addressProvider.getZone(this.country_id).subscribe(
      response => {
        this.zoneResponse = response;
        this.zoneData = this.zoneResponse.data;
        this.zones = this.zoneData.zone;
      },
      err => console.error(err),
      () => {
        //  this.loadingProvider.dismiss();
      }
    );
    return event;
  }

  getZoneID(zone) {
    console.log("selected zone : " + zone);
  }

}