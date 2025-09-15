 
export interface Account {
  _id: string;
  accountNumber: string;
  userId: string;
  type: 'savings' | 'current' | 'checking' | 'business' | 'investment';
  balance: number;
  status: 'active' | 'frozen' | 'suspended' | 'closed';
  transactions: Transaction[];
}

export interface Transaction {
  _id?: string;
  txnId: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  timestamp: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}
