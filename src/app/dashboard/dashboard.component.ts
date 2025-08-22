import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userEmail = signal('');

  constructor(private router: Router) {}

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
