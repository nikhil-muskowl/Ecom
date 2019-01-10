import { Injectable } from '@angular/core';

@Injectable()
export class ConfigProvider {


  // static BASE_URL: string = 'http:// 172.16.8.87/opencart/beauty/index.php?route=restapi/';
  static BASE_URL: string = 'http://beauty.muskowl.com/index.php';
  static payPalEnvironmentSandbox = 'AUAwzZTXZ0BsknmtuOF_-Z9GsmBEchDu7SkXMDW93vd7aT4zP5kK2oEqXjralGCnMFJpH6a3V_gvsxFc';
  static payPalEnvironmentProduction = '';

  constructor() {
  }
}
