import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RegistrationPage } from '../registration/registration';
import { HomePage } from '../../Main/home/home';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { LoginProvider } from '../../../providers/login/login';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public heading_title;
  submitAttempt;
  loginForm: FormGroup;
  private formData: any;
  private status;
  private message;
  private responseData;
  private responseDbData;

  //text
  public email_txt;
  public password_txt;
  public sign_in_txt;
  public sign_up_txt;
  public new_here_txt;
  public success_txt;
  public error_txt;

  //warning msg
  private error_email;
  private error_password;
  private error_warning;
  private success;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public platform: Platform,
    public translate: TranslateService,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public languageProvider: LanguageProvider,
    public loginProvider: LoginProvider, ) {

    this.setText();
    this.createForm();
    platform.registerBackButtonAction(() => {
      this.goBack();
    });
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      password: ['', Validators.required]
    });
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('sign_in').subscribe((text: string) => {
      this.sign_in_txt = text;
    });
    this.translate.get('email').subscribe((text: string) => {
      this.email_txt = text;
    });
    this.translate.get('password').subscribe((text: string) => {
      this.password_txt = text;
    });
    this.translate.get('sign_up').subscribe((text: string) => {
      this.sign_up_txt = text;
    });
    this.translate.get('new_here').subscribe((text: string) => {
      this.new_here_txt = text;
    });
    this.translate.get('login').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('error_password').subscribe((text: string) => {
      this.error_password = text;
    });
    this.translate.get('error_email').subscribe((text: string) => {
      this.error_email = text;
    });
    this.translate.get('error').subscribe((text: string) => {
      this.error_txt = text;
    });
    this.translate.get('success').subscribe((text: string) => {
      this.success_txt = text;
    });
  }

  save() {

    this.submitAttempt = true;
    this.formData = this.loginForm.valid;

    if (this.loginForm.valid) {

      this.loadingProvider.present();

      this.loginProvider.apiLogin(this.loginForm.value).subscribe(
        response => {
          this.responseData = response;

          this.submitAttempt = true;

          if (this.responseData.success == 'Success') {

            this.loginForm.reset();
            this.submitAttempt = false;
            console.log("Login data : " + JSON.stringify(this.responseData));
            this.loginProvider.setData(this.responseData);

            this.success = this.responseData.success;
            this.alertProvider.title = this.success_txt;
            this.alertProvider.message = this.success;
            this.alertProvider.showAlert();

            this.navCtrl.setRoot(HomePage);
            this.loadingProvider.dismiss();
          }

          if (this.responseData.error_warning && this.responseData.error_warning != '') {
            this.error_warning = this.responseData.error_warning;

            // Commented this code coz only warning need not alert and warning both.
            // this.alertProvider.title = 'Warning';
            // this.alertProvider.message = this.error_warning;
            // this.alertProvider.showAlert();
            this.loadingProvider.dismiss();

          }
        },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        }
      );
    }
  }

  goBack() {
    this.navCtrl.setRoot(HomePage);
  }

  goToRegsiter() {
    this.navCtrl.push(RegistrationPage);
  }
}
