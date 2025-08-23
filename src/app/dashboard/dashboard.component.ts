import { Component, signal, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  userEmail = signal('');
  private router = inject(Router);
  private authService = inject(AuthService);

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
