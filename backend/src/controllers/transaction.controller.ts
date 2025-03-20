import { Request, Response } from 'express';
import transactionModel from '../models/transaction.model';
import bankAccountModel from '../models/bank-account.model';
import bankApiService from '../services/bank-api.service';
import supabaseService from '../services/supabase.service';
import { TransactionCreate, TransactionUpdate } from '../types';

class TransactionController {
  // Get all transactions for the current user
  async getTransactions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authenticated' 
        });
      }
      
      // Parse query parameters
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      // Fetch transactions from our model
      const transactions = transactionModel.findByUserId(req.user.id, limit, offset);
      
      return res.status(200).json({
        success: true,
        data: transactions,
        pagination: {
          limit,
          offset,
          total: transactions.length
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Server error';
      return res.status(500).json({ 
        success: false, 
        message: errorMessage 
      });
    }
  }

  // Get transactions for a specific account
  async getAccountTransactions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authenticated' 
        });
      }
      
      const accountId = req.params.accountId;
      
      // Check if the account exists and belongs to the user
      const account = bankAccountModel.findById(accountId);
      if (!account || account.userId !== req.user.id) {
        return res.status(404).json({ 
          success: false, 
          message: 'Account not found or you do not have access to it' 
        });
      }
      
      // Parse query parameters
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      // Check if we need to fetch new transactions from the bank API
      const shouldFetchFromApi = req.query.refresh === 'true';
      
      if (shouldFetchFromApi) {
        try {
          // Parse date range if provided
          const fromDate = req.query.fromDate ? new Date(req.query.fromDate as string) : undefined;
          const toDate = req.query.toDate ? new Date(req.query.toDate as string) : undefined;
          
          const apiResponse = await bankApiService.fetchTransactions(req.user.id, accountId, fromDate, toDate);
          
          if (apiResponse.success && apiResponse.data) {
            // Save transactions to model and Supabase
            const newTransactions = apiResponse.data;
            await supabaseService.saveTransactions(req.user.id, newTransactions);
            
            // Return the new transactions
            return res.status(200).json({
              success: true,
              data: newTransactions,
              pagination: {
                limit,
                offset,
                total: newTransactions.length
              }
            });
          }
        } catch (apiError) {
          console.error('Failed to fetch transactions from bank API:', apiError);
          // Continue with existing transactions
        }
      }
      
      // Fetch transactions from our model
      const transactions = transactionModel.findByAccountId(accountId, limit, offset);
      
      return res.status(200).json({
        success: true,
        data: transactions,
        pagination: {
          limit,
          offset,
          total: transactions.length
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Server error';
      return res.status(500).json({ 
        success: false, 
        message: errorMessage 
      });
    }
  }

  // Get a specific transaction
  async getTransaction(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authenticated' 
        });
      }
      
      const transactionId = req.params.id;
      const transaction = transactionModel.findById(transactionId);
      
      if (!transaction) {
        return res.status(404).json({ 
          success: false, 
          message: 'Transaction not found' 
        });
      }
      
      // Check if the transaction belongs to the current user
      if (transaction.userId !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'You do not have permission to access this transaction' 
        });
      }
      
      return res.status(200).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Server error';
      return res.status(500).json({ 
        success: false, 
        message: errorMessage 
      });
    }
  }

  // Search transactions
  async searchTransactions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authenticated' 
        });
      }
      
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ 
          success: false, 
          message: 'Search query is required' 
        });
      }
      
      // Parse pagination parameters
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      // Search transactions
      const transactions = transactionModel.search(req.user.id, query, limit, offset);
      
      // Also search in Supabase
      try {
        const supabaseResults = await supabaseService.searchTransactions(req.user.id, query);
        
        // Combine results (avoiding duplicates)
        const existingIds = new Set(transactions.map(t => t.id));
        for (const t of supabaseResults) {
          if (!existingIds.has(t.id)) {
            transactions.push(t);
            existingIds.add(t.id);
          }
        }
      } catch (supabaseError) {
        console.error('Failed to search in Supabase:', supabaseError);
        // Continue with local results
      }
      
      return res.status(200).json({
        success: true,
        data: transactions,
        pagination: {
          limit,
          offset,
          total: transactions.length
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Server error';
      return res.status(500).json({ 
        success: false, 
        message: errorMessage 
      });
    }
  }

  // Create a new transaction
  async createTransaction(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authenticated' 
        });
      }
      
      const transactionData: TransactionCreate = req.body;
      
      // Validate input
      if (!transactionData.accountId || 
          transactionData.amount === undefined || 
          !transactionData.description || 
          !transactionData.category || 
          !transactionData.date || 
          !transactionData.type) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }
      
      // Check if the account exists and belongs to the user
      const account = bankAccountModel.findById(transactionData.accountId);
      if (!account || account.userId !== req.user.id) {
        return res.status(404).json({ 
          success: false, 
          message: 'Account not found or you do not have access to it' 
        });
      }
      
      // Create the transaction
      const transaction = transactionModel.create(req.user.id, transactionData);
      
      // Save to Supabase
      await supabaseService.saveTransaction(req.user.id, transaction);
      
      // Update account balance
      bankAccountModel.updateBalance(transactionData.accountId, transactionData.amount);
      
      return res.status(201).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Server error';
      return res.status(500).json({ 
        success: false, 
        message: errorMessage 
      });
    }
  }

  // Update a transaction
  async updateTransaction(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authenticated' 
        });
      }
      
      const transactionId = req.params.id;
      const updateData: TransactionUpdate = req.body;
      
      // Find the transaction
      const transaction = transactionModel.findById(transactionId);
      
      if (!transaction) {
        return res.status(404).json({ 
          success: false, 
          message: 'Transaction not found' 
        });
      }
      
      // Check if the transaction belongs to the current user
      if (transaction.userId !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'You do not have permission to update this transaction' 
        });
      }
      
      // Update the transaction
      const updatedTransaction = transactionModel.update(transactionId, updateData);
      
      if (!updatedTransaction) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to update transaction' 
        });
      }
      
      // If amount changed, update account balance
      if (updateData.amount !== undefined && updateData.amount !== transaction.amount) {
        const amountDifference = updateData.amount - transaction.amount;
        bankAccountModel.updateBalance(transaction.accountId, amountDifference);
      }
      
      // Update in Supabase
      await supabaseService.updateTransaction(req.user.id, transactionId, updateData);
      
      return res.status(200).json({
        success: true,
        data: updatedTransaction
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Server error';
      return res.status(500).json({ 
        success: false, 
        message: errorMessage 
      });
    }
  }

  // Delete a transaction
  async deleteTransaction(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authenticated' 
        });
      }
      
      const transactionId = req.params.id;
      
      // Find the transaction
      const transaction = transactionModel.findById(transactionId);
      
      if (!transaction) {
        return res.status(404).json({ 
          success: false, 
          message: 'Transaction not found' 
        });
      }
      
      // Check if the transaction belongs to the current user
      if (transaction.userId !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'You do not have permission to delete this transaction' 
        });
      }
      
      // Delete the transaction
      const deleted = transactionModel.delete(transactionId);
      
      if (!deleted) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to delete transaction' 
        });
      }
      
      // Reverse the transaction amount in the account balance
      bankAccountModel.updateBalance(transaction.accountId, -transaction.amount);
      
      // Delete from Supabase
      await supabaseService.deleteTransaction(req.user.id, transactionId);
      
      return res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Server error';
      return res.status(500).json({ 
        success: false, 
        message: errorMessage 
      });
    }
  }
}

export default new TransactionController();
