import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { UserModel } from './user.model';

export interface AuthResponse {
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
}

Injectable({
  providedIn: 'root',
});
export class AuthService {
  private httpClient = inject(HttpClient);
  private readonly API_KEY = 'AIzaSyBGe9jO8SJU3jyNkj6N2izJkrYL1ehenBc';
  private readonly SIGN_UP_API_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;
  private readonly VERIFY_PASSWORD_API_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;
  public user = new Subject<UserModel>();
  private isAuthenticated = false;

  constructor() {}

  get getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  signIn(email: string, password: string): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(this.VERIFY_PASSWORD_API_URL, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error) => {
          return this.handleSignInError(error);
        }),
        tap((value) => {
          this.handleSignIn(value);
        })
      );
  }

  private handleSignIn(value: AuthResponse) {
    const expirationDate = new Date(new Date().getTime() + +value.expiresIn * 1000);
    const user = new UserModel(value.email, value.localId, value.idToken, expirationDate);
    this.user.next(user);
    this.isAuthenticated = true;
  }

  private handleSignInError(error: any) {
    let errorMessage = 'An error occurred';

    switch (error.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMessage =
          'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'The user account has been disabled by an administrator.';
        break;
      default:
        errorMessage = error.error.error.message;
        break;
    }

    return throwError(() => new Error(errorMessage));
  }

  signUp(email: string, password: string): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(this.SIGN_UP_API_URL, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error) => {
          let errorMessage = 'An error occurred';

          switch (error.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'Email already exists';
              break;
            case 'OPERATION_NOT_ALLOWED':
              errorMessage = 'Operation not allowed';
              break;
            default:
              errorMessage = error.error.error.message;
              break;
          }

          return throwError(() => new Error(errorMessage));
        }),
        tap((value) => {
          this.handleSignIn(value);
        })
      );
  }
}
