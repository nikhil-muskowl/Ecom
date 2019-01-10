import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertProvider } from '../../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoginProvider } from '../../../providers/login/login';
import { AlertController, Alert } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  heading_title;
  submitAttempt;
  forgPasswordForm: FormGroup;
  private formData: any;
  private status;
  private message;
  private responseData;
  private responseDbData;

  private error_email;
  private success;
  private error;
  public alert: Alert;
  //txt
  public update_txt;
  public email_txt;
  public send_txt;
  public ok_txt;
  public error_txt;
  public success_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public formBuilder: FormBuilder,
    public loginProvider: LoginProvider,
    public translate: TranslateService,
    public alertProvider: AlertProvider,
    public languageProvider: LanguageProvider,
    public alertCtrl: AlertController,
  ) {

    platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.setText();
    this.createForm();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('forgot_password').subscribe((text: string) => {
      this.heading_title = text;
    });
    this.translate.get('error_email').subscribe((text: string) => {
      this.error_email = text;
    });
    this.translate.get('email').subscribe((text: string) => {
      this.email_txt = text;
    });
    this.translate.get('send').subscribe((text: string) => {
      this.send_txt = text;
    });
    this.translate.get('ok').subscribe((text: string) => {
      this.ok_txt = text;
    });
    this.translate.get('error').subscribe((text: string) => {
      this.error_txt = text;
    });
    this.translate.get('success').subscribe((text: string) => {
      this.success_txt = text;
    });
  }

  createForm() {
    this.forgPasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])]
    });
  }
  goBack() {
    this.navCtrl.pop();
  }

  send() {

    this.submitAttempt = true;
    if (this.forgPasswordForm.valid) {
      // this.loadingProvider.present();

      this.formData = this.forgPasswordForm.valid;

      this.loginProvider.forgotPassword(this.forgPasswordForm.value).subscribe(
        response => {
          this.responseData = response;

          this.submitAttempt = true;

          if (this.responseData.status) {
            this.forgPasswordForm.reset();
            this.submitAttempt = false;

            this.alert = this.alertCtrl.create({
              title: this.success_txt,
              message: this.responseData.success,
              buttons: [
                {
                  text: this.ok_txt,
                  handler: () => {
                    this.platform.exitApp();
                  }
                },
              ]
            });
            this.alert.present();
          }
          else {

            this.alert = this.alertCtrl.create({
              title: this.error_txt,
              message: this.responseData.error_warning,
              buttons: [
                {
                  text: this.ok_txt,
                  handler: () => {
                    this.platform.exitApp();
                  }
                },
              ]
            });
            this.alert.present();
          }
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
}
