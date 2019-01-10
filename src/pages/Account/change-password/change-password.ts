import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertProvider } from '../../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  public heading_title;
  submitAttempt;
  passwordForm: FormGroup;
  private formData: any;
  private status;
  private message;
  private responseData;
  private responseDbData;

  //error
  private error_password;
  private error_confirm;
  private error_currentpasswordtxt;
  private error_currentpassword;
  private success;
  private error;

  //txt
  public update_txt;
  public pass_txt;
  public conf_pass_txt;
  public curr_pass_txt;
  public success_txt;
  public warning_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public formBuilder: FormBuilder,
    public loginProvider: LoginProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public alertProvider: AlertProvider,
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

    this.translate.get('error_password').subscribe((text: string) => {
      this.error_password = text;
    });
    this.translate.get('error_confirm').subscribe((text: string) => {
      this.error_confirm = text;
    });
    this.translate.get('error_currentpassword').subscribe((text: string) => {
      this.error_currentpasswordtxt = text;
    });
    this.translate.get('update_password').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('update').subscribe((text: string) => {
      this.update_txt = text;
    });
    this.translate.get('confirm_password').subscribe((text: string) => {
      this.conf_pass_txt = text;
    });
    this.translate.get('password').subscribe((text: string) => {
      this.pass_txt = text;
    });
    this.translate.get('curr_password').subscribe((text: string) => {
      this.curr_pass_txt = text;
    });
    this.translate.get('success').subscribe((text: string) => {
      this.success_txt = text;
    });
    this.translate.get('warning').subscribe((text: string) => {
      this.warning_txt = text;
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  createForm() {
    this.passwordForm = this.formBuilder.group({
      currentpassword: ['', Validators.required],
      password: ['', Validators.required],
      confirm: ['', Validators.required]
    });
  }

  save() {
    this.submitAttempt = true;
    this.formData = this.passwordForm.valid;

    if (this.passwordForm.valid) {
      if (this.passwordForm.value.password == this.passwordForm.value.password.confirm) {
        this.loadingProvider.present();

        this.loginProvider.changePassword(this.passwordForm.value).subscribe(
          response => {
            this.responseData = response;
            this.submitAttempt = true;

            if (this.responseData.success && this.responseData.success != '' && this.responseData.success != null) {
              this.success = this.responseData.success;
              this.alertProvider.title = this.success;
              this.alertProvider.message = this.success;
              this.alertProvider.showAlert();
              this.passwordForm.reset();
              this.submitAttempt = false;
              this.loginProvider.logout();
              this.navCtrl.push(LoginPage);
            }

            if (this.responseData.error && this.responseData.error != '' && this.responseData.error == null) {
              this.error = this.responseData.error;
              this.alertProvider.title = this.warning_txt;
              this.alertProvider.message = this.error;
              this.alertProvider.showAlert();
            }

            if (this.responseData.error_currentpassword != '') {
              this.passwordForm.controls['currentpassword'].setErrors({ 'incorrect': true });
              this.error_currentpassword = this.responseData.error_currentpassword;
            }

            if (this.responseData.error != '') {
              if (this.responseData.error != 'null') {
                this.passwordForm.controls['currentpassword'].setErrors({ 'incorrect': true });
                this.error_currentpassword = 'Error : Current password is not valid!';
              }
            }
            this.loadingProvider.dismiss();
          },
          err => console.error(err),
          () => {
            this.loadingProvider.dismiss();
          }
        );
      }
    }

  }

}
