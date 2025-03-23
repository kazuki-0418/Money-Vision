import { Request, Response } from "express";
import bankAccountModel from "../models/bank-account.model";
import transactionModel from "../models/transaction.model";
import { TransactionCreate, TransactionUpdate } from "../types/transactions";

class TransactionController {
  // Get all transactions for the current user
  async getTransactions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      // Parse query parameters
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : 0;

      // Fetch transactions from our model
      const transactions = await transactionModel.findByUserId(req.user.id, limit, offset);

      return res.status(200).json({
        success: true,
        data: transactions,
        pagination: {
          limit,
          offset,
          total: transactions.length,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  // Get transactions for a specific account
  async getAccountTransactions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const accountId = req.params.accountId;

      // Check if the account exists and belongs to the user
      const account = await bankAccountModel.getBankAccountById(accountId);
      if (!account || account.userId !== req.user.id) {
        return res.status(404).json({
          success: false,
          message: "Account not found or you do not have access to it",
        });
      }

      // Parse query parameters
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : 0;

      // Fetch transactions from our model
      const transactions = await transactionModel.findByAccountId(accountId, limit, offset);

      return res.status(200).json({
        success: true,
        data: transactions,
        pagination: {
          limit,
          offset,
          total: transactions.length,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  // Get a specific transaction
  async getTransaction(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const transactionId = req.params.id;
      const transaction = await transactionModel.findById(transactionId);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  // Search transactions
  async searchTransactions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const query = req.query.q as string;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      // Parse pagination parameters
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : 0;

      // Search transactions
      const transactions = await transactionModel.search(req.user.id, query, limit, offset);

      return res.status(200).json({
        success: true,
        data: transactions,
        pagination: {
          limit,
          offset,
          total: transactions.length,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  // Create a new transaction
  async createTransaction(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const transactionData: TransactionCreate = req.body;

      // Validate input
      if (
        !transactionData.accountId ||
        transactionData.amount === undefined ||
        !transactionData.description ||
        !transactionData.category ||
        !transactionData.date ||
        !transactionData.type
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Check if the account exists and belongs to the user
      const account = await bankAccountModel.getBankAccountById(transactionData.accountId);
      if (!account || account.userId !== req.session.user.id) {
        return res.status(404).json({
          success: false,
          message: "Account not found or you do not have access to it",
        });
      }

      // Create the transaction
      const transaction = await transactionModel.create(req.session.user.id, transactionData);

      return res.status(201).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  // Create multiple transactions at once
  async createTransactions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const transactions: TransactionCreate[] = req.body;

      if (!Array.isArray(transactions) || transactions.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid input: expected non-empty array of transactions",
        });
      }

      // Validate each transaction
      for (const transaction of transactions) {
        if (
          !transaction.accountId ||
          transaction.amount === undefined ||
          !transaction.description ||
          !transaction.category ||
          !transaction.date ||
          !transaction.type
        ) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields in one or more transactions",
          });
        }

        // Check if the account exists and belongs to the user
        const account = await bankAccountModel.getBankAccountById(transaction.accountId);
        if (!account || account.userId !== req.user.id) {
          return res.status(404).json({
            success: false,
            message: "One or more accounts not found or you do not have access to them",
          });
        }
      }

      // Save all transactions
      const success = await transactionModel.saveMany(req.user.id, transactions);

      if (!success) {
        return res.status(500).json({
          success: false,
          message: "Failed to create transactions",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Transactions created successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  // Update a transaction
  async updateTransaction(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const transactionId = req.params.id;
      const updateData: TransactionUpdate = req.body;

      // Find the transaction
      const transaction = await transactionModel.findById(transactionId);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
      }

      // Update the transaction
      const updatedTransaction = transactionModel.update(transactionId, req.user.id, updateData);

      if (!updatedTransaction) {
        return res.status(500).json({
          success: false,
          message: "Failed to update transaction",
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedTransaction,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  // Delete a transaction
  async deleteTransaction(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const transactionId = req.params.id;

      // Find the transaction
      const transaction = await transactionModel.findById(transactionId);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
      }

      // Delete the transaction
      const deleted = transactionModel.delete(transactionId, req.user.id);

      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete transaction",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Transaction deleted successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }
}

export default new TransactionController();
