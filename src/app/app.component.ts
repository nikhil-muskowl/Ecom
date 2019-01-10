import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform, IonicApp, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginProvider } from '../providers/login/login';
//Main
import { HomePage } from '../pages/Main/home/home';
//Account
import { LoginPage } from '../pages/Account/login/login';
//Product
import { CategoriesPage } from '../pages/Products/categories/categories';
import { ProfilePage } from '../pages/Account/profile/profile';
import { WishlistPage } from '../pages/Account/wishlist/wishlist';
import { OrderPage } from '../pages/Orders/order/order';
import { SettingsPage } from '../pages/Main/settings/settings';
import { SpecialOffersPage } from '../pages/Products/special-offers/special-offers';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  public pages: PageInterface[] = [];

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public loginProvider: LoginProvider) {
    this.bindMenu();
    this.splashScreen.hide();
    this.initializeApp();

    // used for an example of ngFor and navigation

    // this.pages = [
    //   { title: 'Home', component: HomePage },
    //   { title: 'List', component: ListPage },
    //   { title: 'Login', component: LoginPage },
    //   { title: 'Category', component: CategoriesPage },
    // ];
  }

  public bindMenu() {
    this.pages.push({ title: 'Home', name: 'TabsPage', component: HomePage, icon: 'assets/icon/Contact.png' });
    if (this.loginProvider.customer_id) {
      this.pages.push({ title: 'Profile', name: 'ProfilePage', component: ProfilePage, icon: 'assets/icon/Contact.png' });
      this.pages.push({ title: 'My Wishlist', name: 'WishlistPage', component: WishlistPage, icon: 'assets/icon/Contact.png' });
      this.pages.push({ title: 'My Orders', name: 'OrderPage', component: OrderPage, icon: 'assets/icon/Contact.png' });
      this.pages.push({ title: 'Special Offers', name: 'SpecialOffersPage', component: SpecialOffersPage, icon: 'assets/icon/Contact.png' });
    }
    else {
      this.pages.push({ title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'assets/icon/Contact.png' });
    }
    this.pages.push({ title: 'Category', name: 'CategoryPage', component: CategoriesPage, icon: 'assets/icon/Contact.png' });
    this.pages.push({ title: 'Settings', name: 'SettingsPage', component: SettingsPage, icon: 'assets/icon/Contact.png' });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
