import { Component, signal, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  userEmail = signal('');
  private router = inject(Router);
  private authService = inject(AuthService);

  /**
   * Initializes the component.
   * Sets the user's email from the authentication service.
   * Uses `take(1)` to get the current user value once and then automatically unsubscribe.
   * Breaking It Down
    this.authService.user - This accesses a user observable from the authentication service, which likely emits the current authenticated user.

    .pipe(take(1)) - The take(1) operator is applied to limit the subscription to only the first emitted value. This ensures the code only runs once when the user data is initially available, rather than every time the user data changes.

    .subscribe((user) => {...}) - This subscribes to the observable, executing the callback function when a value is received.

    This pattern is an efficient way to get user data once and store it in a signal, which is Angular's recommended approach for reactive state management.
   */
  ngOnInit() {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      this.userEmail.set(user?.email ?? '');
    });
  }

  onLogout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/auth']);
  }
}
