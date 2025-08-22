import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

Injectable(
    {
        providedIn: 'root'
    }
)
export class AuthService {
    private httpClient = inject(HttpClient);
    private readonly API_KEY = 'AIzaSyBGe9jO8SJU3jyNkj6N2izJkrYL1ehenBc';
    private readonly API_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;

    constructor() { }

    signUp(email: string, password: string) { 
        return this.httpClient.post(this.API_URL, {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(error => {
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
        }));
    }
}