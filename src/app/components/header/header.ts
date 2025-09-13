import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../pages/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [TitleCasePipe, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  userEmail = signal('');
  private router = inject(Router);
  private authService = inject<AuthService>(AuthService);
  protected routeSegments: string[] = this.router.url.split('/').filter(Boolean);

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

    console.log('Current route segments:', this.routeSegments);
  }

  ngOnInit() {
    console.log('Dashboard initialized');
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
