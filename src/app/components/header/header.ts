import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../pages/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  userEmail = signal('');
  private router = inject(Router);
  private authService = inject<AuthService>(AuthService);

  constructor() {
    // Use effect to react to authentication state changes
    effect(() => {
      const user = this.authService.user();
      if (user) {
        this.userEmail.set(user.email);
      } else {
        this.userEmail.set('');
      }
    });
  }

  ngOnInit() {
    console.log('Dashboard initialized');
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
