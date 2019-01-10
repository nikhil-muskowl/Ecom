import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ScrollHideDirective } from '../directives/scroll-hide/scroll-hide';
import { Ionic2RatingModule } from 'ionic2-rating';

//Main
import { HomePage } from '../pages/Main/home/home';
import { NotificationsPage } from '../pages/Main/notifications/notifications';
import { SettingsPage } from '../pages/Main/settings/settings';

//Orders
import { CartPage } from '../pages/Orders/cart/cart';
import { PaymentAddressPage } from '../pages/Orders/payment-address/payment-address';
import { ShippingAddressPage } from '../pages/Orders/shipping-address/shipping-address';
import { OrderPage } from '../pages/Orders/order/order';
import { OrderDetailsPage } from '../pages/Orders/order-details/order-details';
import { CartEditPage } from '../pages/Orders/cart-edit/cart-edit';
import { PaymentMethodsPage } from '../pages/Orders/payment-methods/payment-methods';
import { DeliveryMethodsPage } from '../pages/Orders/delivery-methods/delivery-methods';
import { ConfirmOrderPage } from '../pages/Orders/confirm-order/confirm-order';

//Account
import { ChangePasswordPage } from '../pages/Account/change-password/change-password';
import { EditProfilePage } from '../pages/Account/edit-profile/edit-profile';
import { ForgotPasswordPage } from '../pages/Account/forgot-password/forgot-password';
import { LoginPage } from '../pages/Account/login/login';
import { ProfilePage } from '../pages/Account/profile/profile';
import { RegistrationPage } from '../pages/Account/registration/registration';
import { WishlistPage } from '../pages/Account/wishlist/wishlist';
import { AddressesPage } from '../pages/Account/addresses/addresses';
import { EditAddressPage } from '../pages/Account/edit-address/edit-address';
import { AddAddressPage } from '../pages/Account/add-address/add-address';

//Products
import { CategoriesPage } from '../pages/Products/categories/categories';
import { ProductListPage } from '../pages/Products/product-list/product-list';
import { ProductDetailsPage } from '../pages/Products/product-details/product-details';
import { FiltersPage } from '../pages/Products/filters/filters';
import { SpecialOffersPage } from '../pages/Products/special-offers/special-offers';

//Component
import { PrivacyPolicyPage } from '../pages/Terms/privacy-policy/privacy-policy';
import { TermsAndConditionPage } from '../pages/Terms/terms-and-condition/terms-and-condition';

//Component
import { CartInfoComponent } from '../components/cart-info/cart-info';
import { ProductReviewComponent } from '../components/product-review/product-review';

//providers
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingProvider } from '../providers/loading/loading';
import { ToastProvider } from '../providers/toast/toast';
import { AlertProvider } from '../providers/alert/alert';
import { LanguageProvider } from '../providers/language/language';
import { ConfigProvider } from '../providers/config/config';
import { LoginProvider } from '../providers/login/login';
import { CategoryProvider } from '../providers/category/category';
import { CartProvider } from '../providers/cart/cart';
import { WishlistProvider } from '../providers/wishlist/wishlist';
import { ModalProvider } from '../providers/modal/modal';
import { OrderProvider } from '../providers/order/order';
import { SettingsProvider } from '../providers/settings/settings';
import { FiltersProvider } from '../providers/filters/filters';
import { AddressProvider } from '../providers/address/address';
import { PaymentsProvider } from '../providers/payments/payments';

//Paypal
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/language/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NotificationsPage,
    ScrollHideDirective,
    ChangePasswordPage,
    EditProfilePage,
    ForgotPasswordPage,
    LoginPage,
    ProfilePage,
    RegistrationPage,
    CategoriesPage,
    ProductListPage,
    ProductDetailsPage,
    CartPage,
    WishlistPage,
    CartInfoComponent,
    ProductReviewComponent,
    PrivacyPolicyPage,
    TermsAndConditionPage,
    PaymentAddressPage,
    ShippingAddressPage,
    OrderPage,
    OrderDetailsPage,
    FiltersPage,
    SettingsPage,
    CartEditPage,
    SpecialOffersPage,
    AddressesPage,
    EditAddressPage,
    AddAddressPage,
    PaymentMethodsPage,
    DeliveryMethodsPage,
    ConfirmOrderPage,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    Ionic2RatingModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    TranslateModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NotificationsPage,
    ChangePasswordPage,
    EditProfilePage,
    ForgotPasswordPage,
    LoginPage,
    ProfilePage,
    RegistrationPage,
    CategoriesPage,
    ProductListPage,
    ProductDetailsPage,
    CartPage,
    WishlistPage,
    CartInfoComponent,
    ProductReviewComponent,
    PrivacyPolicyPage,
    TermsAndConditionPage,
    PaymentAddressPage,
    ShippingAddressPage,
    OrderPage,
    OrderDetailsPage,
    FiltersPage,
    SettingsPage,
    CartEditPage,
    SpecialOffersPage,
    AddressesPage,
    EditAddressPage,
    AddAddressPage,
    PaymentMethodsPage,
    DeliveryMethodsPage,
    ConfirmOrderPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoadingProvider,
    ToastProvider,
    AlertProvider,
    LanguageProvider,
    ConfigProvider,
    LoginProvider,
    CategoryProvider,
    CartProvider,
    WishlistProvider,
    ModalProvider,
    OrderProvider,
    SettingsProvider,
    FiltersProvider,
    AddressProvider,
    PaymentsProvider,
    PayPal,
  ]
})
export class AppModule { }
