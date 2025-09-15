import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service'; // Add this import
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-loan-management',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './loan-management.component.html',
  styleUrls: ['./loan-management.component.css']
})
export class LoanManagementComponent implements OnInit {
  loans: Loan[] = [];
  filteredLoans: Loan[] = [];
  loading = false;
  error = '';
  success = '';
  selectedStatus = 'all';

  statusOptions = [
    { value: 'all', label: 'All Loans' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'active', label: 'Active' },
    { value: 'closed', label: 'Closed' }
  ];

  // Fix: Inject AdminService instead of LoanService
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  // Fix: Use AdminService consistently
  loadLoans(): void {
    this.loading = true;
    this.adminService.getAllLoans().subscribe({
      next: (loans) => {
        this.loans = loans;
        this.filterLoans();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load loans';
        this.loading = false;
        console.error('Error loading loans:', error);
      }
    });
  }

  filterLoans(): void {
    if (this.selectedStatus === 'all') {
      this.filteredLoans = this.loans;
    } else {
      this.filteredLoans = this.loans.filter(loan => loan.status === this.selectedStatus);
    }
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.filterLoans();
  }

  // Fix: Keep only ONE updateLoanStatus method
  updateLoanStatus(loanId: string, newStatus: string): void {
    this.adminService.updateLoanStatus(loanId, newStatus).subscribe({
      next: (updatedLoan) => {
        this.success = `Loan status updated to ${newStatus}`;
        
        // Update the loan in our local array
        const loanIndex = this.loans.findIndex(l => l._id === loanId);
        if (loanIndex !== -1) {
          this.loans[loanIndex] = updatedLoan;
          this.filterLoans();
        }
        
        setTimeout(() => this.success = '', 3000);
      },
      error: (error) => {
        this.error = error.error?.error || 'Failed to update loan status';
        setTimeout(() => this.error = '', 3000);
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
}
