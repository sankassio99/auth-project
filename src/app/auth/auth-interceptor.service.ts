import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

Injectable({
  providedIn: 'root',
});
export class AuthInterceptorService implements HttpInterceptor {
  private authService: AuthService = inject(AuthService);

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.authService.user();

    if (!user) {
      return next.handle(req);
    }

    const modifiedReq = req.clone({ params: new HttpParams().set('auth', user?.token!) });

    return next.handle(modifiedReq);
  }
}
