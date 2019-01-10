import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalController, Modal } from 'ionic-angular';

@Injectable()
export class ModalProvider {

  public modal: Modal;

  constructor(
    public http: HttpClient,
    public modalCtrl: ModalController,
  ) {
  }

  presentProfileModal(Page, Param) {
    if (!this.modal) {
      this.modal = this.modalCtrl.create(Page, Param);
      this.modal.onDidDismiss(data => {
        this.modal = null;
      });
      this.modal.present();
    }
  }

  showConditionsAndPolicy(Page) {
    if (!this.modal) {
      this.modal = this.modalCtrl.create(Page);
      this.modal.onDidDismiss(data => {
        this.modal = null;
      });
      this.modal.present();
    }
  }

  dismiss() {
    if (this.modal) {
      this.modal.dismiss().catch();
      this.modal = null;
    }
  }
}
