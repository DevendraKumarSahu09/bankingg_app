import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../config/environment';
import { Loan } from '../models/loan.model';

export interface DashboardStats {
  totalUsers: number;
  totalAccounts: number;
  totalLoans: number;
  pendingLoans: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/admin/dashboard`);
  }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/admin/loans`);
  }

  updateLoanStatus(loanId: string, status: string): Observable<Loan> {
    return this.http.patch<Loan>(`${this.apiUrl}/loans/${loanId}/status`, { status });
  }
}
