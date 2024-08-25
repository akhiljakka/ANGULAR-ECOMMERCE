import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';

import { Routes, RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard, AuthModule, AuthService } from '@auth0/auth0-angular';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { InfoComponentComponent } from './components/info-component/info-component.component';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { map } from 'rxjs';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';

const routes: Routes = [
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard], data: { onAuthRequired: authGuardRedirect }},
  {path: 'members', component: MembersPageComponent, canActivate: [AuthGuard], data: { onAuthRequired: authGuardRedirect }},
  {path: 'about-us', component: InfoComponentComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    InfoComponentComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain: 'dev-tc3agayubqiz1p0c.us.auth0.com',
      clientId: 'xU2cEmXcrOZqG6Zvdciv6ENL6nZ5HQav',
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
      authorizationParams: {
        audience: 'https://dev-tc3agayubqiz1p0c.us.auth0.com/api/v2/',
        redirect_uri: window.location.origin
      }
    })
  ],
  providers: [ProductService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function authGuardRedirect(injector: Injector) {
  return () => {
    const router = injector.get(Router);
    const auth = injector.get(AuthService);
    return auth.isAuthenticated$.pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          router.navigate(['/login']);
          return false;
        }
      })
    );
  };
}
