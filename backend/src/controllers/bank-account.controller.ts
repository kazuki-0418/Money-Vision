import { Request, Response } from "express";
import bankAccountModel from "../models/bank-account.model";
import bankApiService from "../services/bank-api.service";
import supabaseService from "../services/supabase.service";

class BankAccountController {
  // Get all accounts for the current user
  async getAccounts(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      // Fetch accounts from our model
      const accounts = bankAccountModel.findByUserId(req.user.id);

      // If no accounts, try fetching from the bank API
      if (accounts.length === 0) {
        const apiResponse = await bankApiService.fetchAccounts(req.user.id);

        if (apiResponse.success && apiResponse.data) {
          // Save accounts to our model and Supabase
          for (const account of apiResponse.data) {
            bankAccountModel.create(req.user.id, account);
            await supabaseService.saveBankAccount(req.user.id, account);
          }

          return res.status(200).json({
            success: true,
            data: apiResponse.data,
          });
        }
      }

      return res.status(200).json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  // Get account by ID
  async getAccountById(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const accountId = req.params.id;
      const account = bankAccountModel.findById(accountId);

      if (!account) {
        return res.status(404).json({
          success: false,
          message: "Account not found",
        });
      }

      // Check if the account belongs to the current user
      if (account.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this account",
        });
      }

      // Fetch the latest balance from the bank API
      try {
        const balanceResponse = await bankApiService.fetchAccountBalance(req.user.id, accountId);

        if (balanceResponse.success && balanceResponse.data) {
          // Update the account balance
          account.balance = balanceResponse.data.balance;
          account.updatedAt = new Date();
        }
      } catch (apiError) {
        // Continue with the existing balance if API fails
        console.error("Failed to fetch latest balance:", apiError);
      }

      return res.status(200).json({
        success: true,
        data: account,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  // Refresh account balances
  async refreshBalances(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const accounts = bankAccountModel.findByUserId(req.user.id);
      const updatedAccounts = [];

      for (const account of accounts) {
        try {
          const balanceResponse = await bankApiService.fetchAccountBalance(req.user.id, account.id);

          if (balanceResponse.success && balanceResponse.data) {
            // Update the account balance
            account.balance = balanceResponse.data.balance;
            account.updatedAt = new Date();
            updatedAccounts.push(account);
          }
        } catch (apiError) {
          console.error(`Failed to fetch balance for account ${account.id}:`, apiError);
        }
      }

      return res.status(200).json({
        success: true,
        data: updatedAccounts,
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

export default new BankAccountController();
