 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})

export class TransferComponent implements OnInit {
  transferForm: FormGroup;
  accounts: Account[] = [];
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService
  ) {
    this.transferForm = this.fb.group({
      fromAccountId: ['', Validators.required],
      toAccountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts.filter(acc => acc.status === 'active');
      },
      error: (error) => {
        this.error = 'Failed to load accounts';
        console.error('Error loading accounts:', error);
      }
    });
  }

  onTransfer(): void {
    if (this.transferForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const transferData = this.transferForm.value;
      
      if (transferData.fromAccountId === transferData.toAccountId) {
        this.error = 'Cannot transfer to the same account';
        this.loading = false;
        return;
      }

      const fromAccount = this.accounts.find(acc => acc._id === transferData.fromAccountId);
      if (fromAccount && transferData.amount > fromAccount.balance) {
        this.error = 'Insufficient balance in source account';
        this.loading = false;
        return;
      }

      this.accountService.transfer(transferData).subscribe({
        next: (response) => {
          this.success = `Successfully transferred $${transferData.amount}`;
          this.transferForm.reset();
          this.loadAccounts(); // Reload to get updated balances
          this.loading = false;
          setTimeout(() => this.success = '', 5000);
        },
        error: (error) => {
          this.error = error.error?.error || 'Transfer failed';
          this.loading = false;
        }
      });
    }
  }

  getAccountDisplay(account: Account): string {
    return `${account.type.toUpperCase()} - ${account.accountNumber} ($${account.balance.toFixed(2)})`;
  }

  getFromAccountBalance(): number {
    const fromAccountId = this.transferForm.get('fromAccountId')?.value;
    const account = this.accounts.find(acc => acc._id === fromAccountId);
    return account ? account.balance : 0;
  }

  getToAccounts(): Account[] {
    const fromAccountId = this.transferForm.get('fromAccountId')?.value;
    return this.accounts.filter(acc => acc._id !== fromAccountId);
  }

  // Add these helper methods for template
  getFromAccountNumber(): string {
    const fromAccountId = this.transferForm.get('fromAccountId')?.value;
    const account = this.accounts.find(acc => acc._id === fromAccountId);
    return account ? account.accountNumber : '';
  }

  getToAccountNumber(): string {
    const toAccountId = this.transferForm.get('toAccountId')?.value;
    const account = this.accounts.find(acc => acc._id === toAccountId);
    return account ? account.accountNumber : '';
  }

  getTransferAmount(): number {
    return this.transferForm.get('amount')?.value || 0;
  }
}
