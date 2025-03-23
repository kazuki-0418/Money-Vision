import { Request, Response } from "express";
import bankAccountModel from "../models/bank-account.model";

class BankAccountController {
  // Get all accounts for the current user
  async getAccounts(req: Request, res: Response) {
    try {
      if (!req.session.user || !req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      // Fetch accounts from our model
      const accounts = await bankAccountModel.loadUserBankAccounts(req.session.user.id);

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
      const account = await bankAccountModel.getBankAccountById(accountId);

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
        const account = await bankAccountModel.getBankAccountById(accountId);
        return res.status(200).json({
          success: true,
          data: account,
        });
      } catch (apiError) {
        // Continue with the existing balance if API fails
        console.error("Failed to fetch latest balance:", apiError);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  // Create a new account
  async createAccount(req: Request, res: Response) {
    try {
      if (!req.session.user || !req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const accountData = req.body;
      const newAccount = await bankAccountModel.create(accountData);

      return res.status(201).json({
        success: true,
        data: newAccount,
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
