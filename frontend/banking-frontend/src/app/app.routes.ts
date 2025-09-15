// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent),
    canActivate: [LoginGuard]
  },
  { 
    path: 'signup', 
    loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent),
    canActivate: [LoginGuard]
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'accounts', 
    loadComponent: () => import('./accounts/accounts.component').then(m => m.AccountsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'accounts/create', 
    loadComponent: () => import('./accounts/create-account/create-account.component').then(m => m.CreateAccountComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'accounts/:id', 
    loadComponent: () => import('./accounts/account-details/account-details.component').then(m => m.AccountDetailsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'transfer', 
    loadComponent: () => import('./transfer/transfer.component').then(m => m.TransferComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'loans', 
    loadComponent: () => import('./loans/loans.component').then(m => m.LoansComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'loans/apply', 
    loadComponent: () => import('./loans/apply-loan/apply-loan.component').then(m => m.ApplyLoanComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'loans/:id', 
    loadComponent: () => import('./loans/loan-details/loan-details.component').then(m => m.LoanDetailsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'admin/loans', 
    loadComponent: () => import('./admin/loan-management/loan-management.component').then(m => m.LoanManagementComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: '/login' }
];
