import { Component, signal, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserModel } from '../auth/user.model';

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
  private user: UserModel | null = null;
  private authService = inject(AuthService);
  private userSubscription?: Subscription;

  ngOnInit() {
    console.log('Initialized');

    this.user = this.authService.user();

    this.userEmail.set(this.user?.email ?? '');
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  onLogout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/auth']);
  }
}
