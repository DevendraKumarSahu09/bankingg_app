import User from "../models/User.js";
import { Account } from "../models/Account.js";
import Loan from "../models/Loan.js";

export const getDashboard = async (req, res) => {
  try {
    // Count documents from each collection
    const totalUsers = await User.countDocuments();
    const totalAccounts = await Account.countDocuments();
    const totalLoans = await Loan.countDocuments();
    const pendingLoans = await Loan.countDocuments({ status: 'pending' });

    // Calculate total deposits and withdrawals from account transactions
    const accounts = await Account.find({}, 'transactions');
    let totalDeposits = 0;
    let totalWithdrawals = 0;

    accounts.forEach(account => {
      account.transactions.forEach(txn => {
        if (txn.type === 'deposit' && txn.status === 'success') {
          totalDeposits += txn.amount;
        } else if (txn.type === 'withdraw' && txn.status === 'success') {
          totalWithdrawals += txn.amount;
        }
      });
    });

    res.json({
      totalUsers,
      totalAccounts,
      totalLoans,
      pendingLoans,
      totalDeposits,
      totalWithdrawals
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data: ' + error.message });
  }
};

// Get all loans for admin loan management
export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('userId', 'name email')  // Include user details
      .sort({ createdAt: -1 });
    
    res.json(loans);
  } catch (error) {
    console.error('Error fetching all loans:', error);
    res.status(500).json({ error: 'Failed to fetch loans: ' + error.message });
  }
};
