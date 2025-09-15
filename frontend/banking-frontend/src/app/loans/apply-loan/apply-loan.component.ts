 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-apply-loan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './apply-loan.component.html',
  styleUrls: ['./apply-loan.component.css']
})
export class ApplyLoanComponent {
  loanForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  loanTypes = [
    { value: 'personal', label: 'Personal Loan', rate: 12.5 },
    { value: 'home', label: 'Home Loan', rate: 8.5 },
    { value: 'education', label: 'Education Loan', rate: 10.0 }
  ];

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private router: Router
  ) {
    this.loanForm = this.fb.group({
      loanType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1000), Validators.max(1000000)]],
      tenureMonths: ['', [Validators.required, Validators.min(6), Validators.max(360)]],
      interestRate: [{value: '', disabled: true}, Validators.required]
    });

    // Auto-update interest rate based on loan type
    this.loanForm.get('loanType')?.valueChanges.subscribe(loanType => {
      const selectedType = this.loanTypes.find(type => type.value === loanType);
      if (selectedType) {
        this.loanForm.patchValue({ interestRate: selectedType.rate });
      }
    });
  }

  onSubmit(): void {
    if (this.loanForm.valid) {
      this.loading = true;
      this.error = '';
      
      const loanData = {
        ...this.loanForm.value,
        interestRate: this.loanForm.get('interestRate')?.value
      };
      
      this.loanService.applyForLoan(loanData).subscribe({
        next: (response) => {
          this.success = 'Loan application submitted successfully!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/loans']);
          }, 2000);
        },
        error: (error) => {
          this.error = error.error?.error || 'Failed to submit loan application';
          this.loading = false;
        }
      });
    }
  }

  calculateEMI(): number {
    const amount = this.loanForm.get('amount')?.value;
    const rate = this.loanForm.get('interestRate')?.value;
    const tenure = this.loanForm.get('tenureMonths')?.value;

    if (!amount || !rate || !tenure) return 0;

    const monthlyRate = (rate / 100) / 12;
    const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
    
    return isNaN(emi) ? 0 : emi;
  }

  get loanType() { return this.loanForm.get('loanType'); }
  get amount() { return this.loanForm.get('amount'); }
  get tenureMonths() { return this.loanForm.get('tenureMonths'); }
  get interestRate() { return this.loanForm.get('interestRate'); }
}
