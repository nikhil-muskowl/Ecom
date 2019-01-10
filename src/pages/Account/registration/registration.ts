import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../../Main/home/home';
import { LoginPage } from '../login/login';
import { ContactValidator } from '../../../validators/contact';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoginProvider } from '../../../providers/login/login';
import { ProfilePage } from '../profile/profile';
import { TermsAndConditionPage } from '../../Terms/terms-and-condition/terms-and-condition';
import { PrivacyPolicyPage } from '../../Terms/privacy-policy/privacy-policy';
import { ModalProvider } from '../../../providers/modal/modal';

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  public heading_title;
  submitAttempt;
  registerForm: FormGroup;
  private formData: any;
  private status;
  private message;
  private responseData;

  //text
  public firstname_txt;
  public lastname_txt;
  public male_txt;
  public female_txt;
  public gender_txt;
  public dob_txt;
  public conf_password_txt;
  public password_txt;
  public phone_txt;
  public email_txt;
  public username_txt;
  public fullname_txt;
  public signin_agree;
  public register_txt;
  public terms;
  public and;
  public already_account;
  public privacy_policy;
  public log_in;
  private dob: any;
  private maxDate: string;

  //warning msg
  private error_fullname;
  private error_firstname;
  private error_lastname;
  private error_username;
  private error_email;
  private error_telephone;
  private error_password;
  private error_confirm;

  private error_dob = 'please select date of birth';
  private error_gender = 'field is required';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public platform: Platform,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public loginProvider: LoginProvider,
    public modalProvider: ModalProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {
    this.setText();

    this.createForm();
    platform.registerBackButtonAction(() => {
      this.goBack();
    });
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('reg_with_us').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('register').subscribe((text: string) => {
      this.register_txt = text;
    });
    this.translate.get('firstname').subscribe((text: string) => {
      this.firstname_txt = text;
    });
    this.translate.get('lastname').subscribe((text: string) => {
      this.lastname_txt = text;
    });
    this.translate.get('username').subscribe((text: string) => {
      this.username_txt = text;
    });
    this.translate.get('email').subscribe((text: string) => {
      this.email_txt = text;
    });
    this.translate.get('password').subscribe((text: string) => {
      this.password_txt = text;
    });
    this.translate.get('conpass').subscribe((text: string) => {
      this.conf_password_txt = text;
    });
    this.translate.get('mobile').subscribe((text: string) => {
      this.phone_txt = text;
    });
    this.translate.get('dob').subscribe((text: string) => {
      this.dob_txt = text;
    });
    this.translate.get('gender').subscribe((text: string) => {
      this.gender_txt = text;
    });
    this.translate.get('male').subscribe((text: string) => {
      this.male_txt = text;
    });
    this.translate.get('female').subscribe((text: string) => {
      this.female_txt = text;
    });
    this.translate.get('signin_agree').subscribe((text: string) => {
      this.signin_agree = text;
    });
    this.translate.get('terms').subscribe((text: string) => {
      this.terms = text;
    });
    this.translate.get('and').subscribe((text: string) => {
      this.and = text;
    });
    this.translate.get('privacy_policy').subscribe((text: string) => {
      this.privacy_policy = text;
    });
    this.translate.get('already_account').subscribe((text: string) => {
      this.already_account = text;
    });
    this.translate.get('log_in').subscribe((text: string) => {
      this.log_in = text;
    });
    this.translate.get('error_firstname').subscribe((text: string) => {
      this.error_firstname = text;
    });
    this.translate.get('error_lastname').subscribe((text: string) => {
      this.error_lastname = text;
    });
    this.translate.get('error_contact').subscribe((text: string) => {
      this.error_telephone = text;
    });
    this.translate.get('error_confirm').subscribe((text: string) => {
      this.error_confirm = text;
    });
    this.translate.get('error_name').subscribe((text: string) => {
      this.error_fullname = text;
    });
    this.translate.get('error_password').subscribe((text: string) => {
      this.error_password = text;
    });
    this.translate.get('error_email').subscribe((text: string) => {
      this.error_email = text;
    });
  }

  @ViewChild('datePicker') datePicker;
  open() {
    this.maxDate = new Date().toISOString().split('T')[0];
    if (!this.dob) {
      this.dob = new Date().toJSON().split('T')[0];
      setTimeout(() => {
        this.datePicker.open();
      }, 50)
    } else {
      this.datePicker.open();
    }
  }

  goBack() {
    this.navCtrl.setRoot(LoginPage);
  }

  backButtonClick() {
    this.navCtrl.pop();
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.compose([Validators.maxLength(32), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastname: ['', Validators.compose([Validators.maxLength(32), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      // username: ['', Validators.compose([Validators.maxLength(32), Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      // telephone: ['', ContactValidator.isValid],
      telephone: ['', Validators.required],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
      // dob: ['', Validators.required],
      // gender: ['', Validators.required]
    });
  }

  save() {
    this.submitAttempt = true;
    if (this.registerForm.valid) {
      // this.loadingProvider.present();

      this.formData = this.registerForm.valid;

      this.loginProvider.apiRegister(this.registerForm.value).subscribe(
        response => {
          this.responseData = response;

          this.submitAttempt = true;
          console.log("response register : " + JSON.stringify(this.responseData));

          // if (this.responseData.customer_id) {
          //   this.customer_id = this.responseData.customer_id;
          //   this.registerForm.reset();
          //   this.submitAttempt = false;

          //   var data = {
          //     customer_id: this.responseData.customer_id,
          //   };

          //   this.loginProvider.setData(data);
          //   this.navCtrl.push(ProfilePage);
          // }

          // if (this.responseData.text_message != '') {
          //   this.text_message = this.responseData.text_message;
          //   this.alertProvider.title = 'Success';
          //   this.alertProvider.message = this.text_message;
          //   this.alertProvider.showAlert();
          // }

          // if (this.responseData.error_fullname != '') {
          //   this.registerForm.controls['fullname'].setErrors({ 'incorrect': true });
          //   this.error_fullname = this.responseData.error_fullname;
          // }

          // if (this.responseData.error_username != '') {
          //   this.registerForm.controls['username'].setErrors({ 'incorrect': true });
          //   this.error_username = this.responseData.error_username;
          // }

          // if (this.responseData.error_email != '') {
          //   this.registerForm.controls['email'].setErrors({ 'incorrect': true });
          //   this.error_email = this.responseData.error_email;
          // }

          // if (this.responseData.error_telephone != '') {
          //   this.registerForm.controls['telephone'].setErrors({ 'incorrect': true });
          //   this.error_telephone = this.responseData.error_telephone;
          // }

          // if (this.responseData.error_password != '') {
          //   this.registerForm.controls['password'].setErrors({ 'incorrect': true });
          //   this.error_password = this.responseData.error_password;
          // }

          // if (this.responseData.error_confirm != '') {
          //   this.registerForm.controls['confirm'].setErrors({ 'incorrect': true });
          //   this.error_confirm = this.responseData.error_confirm;
          // }

          // if (this.responseData.error_dob != '') {
          //   this.registerForm.controls['dob'].setErrors({ 'incorrect': true });
          //   this.error_dob = this.responseData.error_dob;
          // }

          // if (this.responseData.error_gender != '') {
          //   this.registerForm.controls['gender'].setErrors({ 'incorrect': true });
          //   this.error_gender = this.responseData.error_gender;
          // }

          // if (this.responseData.error_warning && this.responseData.error_warning != '') {
          //   this.error_warning = this.responseData.error_warning;

          //   this.alertProvider.title = 'Warning';
          //   this.alertProvider.message = this.error_warning;
          //   this.alertProvider.showAlert();
          // }

        },
        err => {
          console.error(err);
          //this.loadingProvider.dismiss();
        },
        () => {
          // this.loadingProvider.dismiss();
        }
      );
    }

  }


  public goToTermCondition() {
    this.modalProvider.showConditionsAndPolicy(TermsAndConditionPage);
    this.modalProvider.modal.onDidDismiss(data => {

    });
  }

  public goToPrivacyPolicy() {
    this.modalProvider.showConditionsAndPolicy(PrivacyPolicyPage);
    this.modalProvider.modal.onDidDismiss(data => {
      // This is added to refresh page.
      // this.navCtrl.setRoot(this.navCtrl.getActive().component);
    });
  }


  public goToLogin() {
    this.navCtrl.setRoot(LoginPage);
  }

}
