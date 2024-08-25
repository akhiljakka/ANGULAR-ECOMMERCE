// src/app/services/auth-interceptor.service.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth0Service: Auth0Service) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const securedEndpoints = [environment.baseUrl + '/orders'];

    if (securedEndpoints.some(url => req.urlWithParams.includes(url))) {
      return from(this.auth0Service.getAccessTokenSilently()).pipe(
        switchMap(token => {
          console.log(`token : ${token}`)
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(clonedReq);
        })
      );
    }
    return next.handle(req);
  }
}
