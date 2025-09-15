 
export interface Loan {
  _id: string;
  userId: string;
  loanType: 'personal' | 'home' | 'education';
  amount: number;
  tenureMonths: number;
  interestRate: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplication {
  loanType: 'personal' | 'home' | 'education';
  amount: number;
  tenureMonths: number;
  interestRate: number;
}

export interface Repayment {
  _id: string;
  loanId: string;
  dueDate: string;
  amount: number;
  paid: boolean;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}
