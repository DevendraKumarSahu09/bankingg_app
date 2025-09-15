import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AccountService } from '../services/account.service';
import { LoanService } from '../services/loan.service';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { Account } from '../models/account.model';
import { Loan } from '../models/loan.model';
import { Observable } from 'rxjs';
import { User } from '../store/auth/auth.state';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<User | null>;
  accounts: Account[] = [];
  loans: Loan[] = [];
  totalBalance = 0;
  loading = false;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private loanService: LoanService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Load accounts
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
      },
      error: (error) => console.error('Error loading accounts:', error)
    });

    // Load loans
    this.loanService.getMyLoans().subscribe({
      next: (loans) => {
        this.loans = loans;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading loans:', error);
        this.loading = false;
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
