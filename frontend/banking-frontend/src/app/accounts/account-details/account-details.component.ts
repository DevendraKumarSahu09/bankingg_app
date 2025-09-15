 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Account, Transaction } from '../../models/account.model';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  account: Account | null = null;
  loading = false;
  error = '';
  success = '';
  activeTab = 'overview';

  depositForm: FormGroup;
  withdrawForm: FormGroup;
  
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {
    this.depositForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
    
    this.withdrawForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadAccountDetails(params['id']);
      }
    });
  }

  loadAccountDetails(id: string): void {
    this.loading = true;
    this.accountService.getAccount(id).subscribe({
      next: (account) => {
        this.account = account;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load account details';
        this.loading = false;
        console.error('Error loading account:', error);
      }
    });
  }

  onDeposit(): void {
    if (this.depositForm.valid && this.account) {
      this.loading = true;
      this.error = '';
      
      const amount = this.depositForm.value.amount;
      
      this.accountService.deposit(this.account._id, amount).subscribe({
        next: (response) => {
          this.success = `Successfully deposited $${amount}`;
          this.account = response.account;
          this.depositForm.reset();
          this.loading = false;
          setTimeout(() => this.success = '', 3000);
        },
        error: (error) => {
          this.error = error.error?.error || 'Deposit failed';
          this.loading = false;
        }
      });
    }
  }

  onWithdraw(): void {
    if (this.withdrawForm.valid && this.account) {
      this.loading = true;
      this.error = '';
      
      const amount = this.withdrawForm.value.amount;
      
      if (amount > this.account.balance) {
        this.error = 'Insufficient balance';
        this.loading = false;
        return;
      }
      
      this.accountService.withdraw(this.account._id, amount).subscribe({
        next: (response) => {
          this.success = `Successfully withdrew $${amount}`;
          this.account = response.account;
          this.withdrawForm.reset();
          this.loading = false;
          setTimeout(() => this.success = '', 3000);
        },
        error: (error) => {
          this.error = error.error?.error || 'Withdrawal failed';
          this.loading = false;
        }
      });
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getRecentTransactions(): Transaction[] {
    if (!this.account || !this.account.transactions) return [];
    return [...this.account.transactions]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }
}
