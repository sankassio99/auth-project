import { Component, signal, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  userEmail = signal('');
  private router = inject(Router);
  private userSub: Subscription;
  private isAuthenticated = false;
  private authService = inject(AuthService);

  constructor() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.userEmail.set(user.email);
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  ngOnInit() {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.userEmail.set(email);
    }
  }

  onLogout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/auth']);
  }
}
