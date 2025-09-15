 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Loan, Repayment } from '../../models/loan.model';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {
  loan: Loan | null = null;
  repayments: Repayment[] = [];
  loading = false;
  error = '';
  success = '';
  payingInstallment = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadLoanDetails(params['id']);
      }
    });
  }

  loadLoanDetails(id: string): void {
    this.loading = true;
    
    // Load loan details
    this.loanService.getLoanDetails(id).subscribe({
      next: (loan) => {
        this.loan = loan;
        
        // If loan is approved, load repayment schedule
        if (loan.status === 'approved' || loan.status === 'active') {
          this.loadRepaymentSchedule(id);
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = 'Failed to load loan details';
        this.loading = false;
        console.error('Error loading loan:', error);
      }
    });
  }

  loadRepaymentSchedule(loanId: string): void {
    this.loanService.getRepaymentSchedule(loanId).subscribe({
      next: (repayments) => {
        this.repayments = repayments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading repayment schedule:', error);
        this.loading = false;
      }
    });
  }

  payNextInstallment(): void {
    if (!this.loan) return;

    const nextPayment = this.repayments.find(r => !r.paid);
    if (!nextPayment) {
      this.error = 'No outstanding payments found';
      return;
    }

    this.payingInstallment = true;
    this.error = '';

    this.loanService.payInstallment(this.loan._id, nextPayment.amount).subscribe({
      next: (response) => {
        this.success = `Payment of $${nextPayment.amount} successful!`;
        this.loadRepaymentSchedule(this.loan!._id); // Reload repayment schedule
        this.payingInstallment = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Payment failed';
        this.payingInstallment = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getNextPayment(): Repayment | null {
    return this.repayments.find(r => !r.paid) || null;
  }

  getPaidPayments(): Repayment[] {
    return this.repayments.filter(r => r.paid);
  }

  getOutstandingAmount(): number {
    return this.repayments.filter(r => !r.paid).reduce((sum, r) => sum + r.amount, 0);
  }
}
