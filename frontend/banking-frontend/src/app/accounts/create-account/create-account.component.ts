 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  createAccountForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  accountTypes = [
    { value: 'savings', label: 'Savings Account' },
    { value: 'current', label: 'Current Account' }
  ];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    public router: Router
  ) {
    this.createAccountForm = this.fb.group({
      type: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.createAccountForm.valid) {
      this.loading = true;
      this.error = '';
      
      const accountData = this.createAccountForm.value;
      
      this.accountService.createAccount(accountData).subscribe({
        next: (response) => {
          this.success = 'Account created successfully!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/accounts']);
          }, 2000);
        },
        error: (error) => {
          this.error = error.error?.error || 'Failed to create account';
          this.loading = false;
        }
      });
    }
  }

  get type() { return this.createAccountForm.get('type'); }
}
