import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService, DashboardStats } from '../../services/admin.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentUser$: Observable<any>;
  stats: DashboardStats = {
    totalUsers: 0,
    totalAccounts: 0,
    totalLoans: 0,
    pendingLoans: 0,
    totalDeposits: 0,
    totalWithdrawals: 0
  };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load dashboard statistics';
        this.loading = false;
        console.error('Dashboard error:', error);
      }
    });
  }
}
