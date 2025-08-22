import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoginMode = signal(true);
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  isLoading = signal(false);
  errorMessage = signal('');
  private authService = inject(AuthService);

  constructor(private router: Router) {}

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
        // Simple login logic - accept any email/password for demo
        if (this.email() && this.password()) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userEmail', this.email());
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Invalid credentials');
        }
      } else {
        this.authService
          .signUp(this.email(), this.confirmPassword())
          .subscribe({
            next: (res) => {
              console.log("Logged with success!");
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
      };
  }
}
