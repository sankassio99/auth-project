import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthResponse, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = signal(true);
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  isLoading = signal(false);
  errorMessage = signal('');
  private authService = inject(AuthService);
  private authResponse?: Observable<AuthResponse>;
  private router = inject(Router);
  private userSub: Subscription;
  private isAuthenticated = false;

  constructor() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      if (this.isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode.set(!this.isLoginMode());
    this.errorMessage.set('');
  }

  onSubmit(event: any) {
    event.preventDefault();

    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    if (!this.isLoginMode() && this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.isLoading.set(true);

    if (this.isLoginMode()) {
      this.signIn();
    } else {
      this.signUpUser();
    }

    this.authResponse!.subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/dashboard']);
      },
      error: (errorMessage) => {
        this.errorMessage.set(errorMessage);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  private signUpUser() {
    this.authResponse = this.authService.signUp(this.email(), this.confirmPassword());
  }

  private signIn() {
    this.authResponse = this.authService.signIn(this.email(), this.password());
  }
}
