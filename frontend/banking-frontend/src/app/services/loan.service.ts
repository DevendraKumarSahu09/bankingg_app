 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan, LoanApplication, Repayment } from '../models/loan.model';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/api/loans`;

  constructor(private http: HttpClient) {}

  applyForLoan(loanData: LoanApplication): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/apply`, loanData);
  }

  getMyLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/myloans`);
  }

  getLoanDetails(id: string): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${id}`);
  }

  getRepaymentSchedule(loanId: string): Observable<Repayment[]> {
    return this.http.get<Repayment[]>(`${this.apiUrl}/${loanId}/repayments`);
  }

  payInstallment(loanId: string, paymentAmount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${loanId}/pay`, { paymentAmount });
  }

  // Admin functions
  updateLoanStatus(loanId: string, status: string): Observable<Loan> {
    return this.http.patch<Loan>(`${this.apiUrl}/${loanId}/status`, { status });
  }
}
