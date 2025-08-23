import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private readonly API_KEY = 'AIzaSyBGe9jO8SJU3jyNkj6N2izJkrYL1ehenBc';
  private readonly SIGN_UP_API_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;
  private readonly VERIFY_PASSWORD_API_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;
  private readonly REFRESH_TOKEN_URL = `https://securetoken.googleapis.com/v1/token?key=${this.API_KEY}`;

  // Use signals instead of BehaviorSubject
  private userSignal = signal<UserModel | null>(null);
  public user = computed(() => this.userSignal());
  public isAuthenticated = computed(() => !!this.userSignal());

  // Token expiration timer
  private tokenExpirationTimer: any = null;

  constructor() {
    this.autoLogin();
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
    const user = new UserModel(
      value.email,
      value.localId,
      value.idToken,
      expirationDate,
      value.refreshToken
    );

    // Update the user signal
    this.userSignal.set(user);

    // Store user data in localStorage for persistence
    this.saveUserToStorage(user);

    // Set auto logout timer
    this.autoLogout(+value.expiresIn * 1000);
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

  // Method to refresh the access token using the refresh token
  refreshAccessToken(): Observable<AuthResponse> {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      return throwError(() => new Error('No user data found'));
    }

    const parsedData = JSON.parse(userData);
    const refreshToken = parsedData._refreshToken;

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.httpClient
      .post<AuthResponse>(this.REFRESH_TOKEN_URL, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })
      .pipe(
        tap((response) => {
          this.handleTokenRefresh(response);
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => new Error('Session expired'));
        })
      );
  }

  private handleTokenRefresh(response: AuthResponse) {
    const userData = localStorage.getItem('userData');
    if (!userData) return;

    const parsedData = JSON.parse(userData);
    const expirationDate = new Date(new Date().getTime() + +response.expiresIn * 1000);

    const user = new UserModel(
      parsedData.email,
      parsedData.id,
      response.idToken,
      expirationDate,
      response.refreshToken
    );

    this.userSignal.set(user);
    this.saveUserToStorage(user);
    this.autoLogout(+response.expiresIn * 1000);
  }

  // Automatically log in the user if token exists and is valid
  autoLogin() {
    const userData = localStorage.getItem('userData');
    if (!userData) return;

    const parsedData = JSON.parse(userData);
    const tokenExpirationDate = new Date(parsedData._tokenExpirationDate);

    // If token is expired, try to refresh it
    if (new Date() > tokenExpirationDate) {
      this.refreshAccessToken().subscribe({
        error: () => {
          // If refresh fails, clear storage and stay logged out
          localStorage.removeItem('userData');
        },
      });
      return;
    }

    const user = new UserModel(
      parsedData.email,
      parsedData.id,
      parsedData._token,
      tokenExpirationDate,
      parsedData._refreshToken
    );

    this.userSignal.set(user);

    // Set auto logout for remaining time
    const expirationDuration = tokenExpirationDate.getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
  }

  // Set timer to logout when token expires
  private autoLogout(expirationDuration: number) {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = setTimeout(() => {
      // Try to refresh the token first
      this.refreshAccessToken().subscribe({
        error: () => this.logout(),
      });
    }, expirationDuration);
  }

  // Logout user
  logout() {
    this.userSignal.set(null);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  // Save user data to localStorage
  private saveUserToStorage(user: UserModel) {
    localStorage.setItem(
      'userData',
      JSON.stringify({
        email: user.email,
        id: user.id,
        _token: user.token,
        _tokenExpirationDate: user.tokenExpirationDate.toISOString(),
        _refreshToken: user.refreshToken,
      })
    );
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const user = this.userSignal();
    return !user || !user.token;
  }
}
