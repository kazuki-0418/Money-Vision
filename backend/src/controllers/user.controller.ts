import { Request, Response } from 'express';
import userModel from '../models/user.model';
import bankAccountModel from '../models/bank-account.model';
import transactionModel from '../models/transaction.model';
import { clearSession } from '../middlewares/auth.middleware';
import { UserLogin, UserRegistration } from '../types';

class UserController {
  // Register a new user
  async register(req: Request, res: Response) {
    try {
      const userData: UserRegistration = req.body;
      
      // Validate input
      if (!userData.username || !userData.email || !userData.password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide username, email and password' 
        });
      }
      
      // Create user
      const user = await userModel.create(userData);
      
      // Create session
      if (req.session) {
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email
        };
      }
      
      // Create default bank account and seed test data
      const defaultAccount = bankAccountModel.create(user.id, {
        accountName: '普通預金',
        balance: 250000,
        currency: 'JPY',
        type: 'checking'
      });
      
      // Seed some transactions
      transactionModel.seedTestData(user.id, defaultAccount.id);
      
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user.id,
          username: user.username,
          email: user.email
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

  // Login user
  async login(req: Request, res: Response) {
    try {
      const loginData: UserLogin = req.body;
      
      // Validate input
      if (!loginData.email || !loginData.password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide email and password' 
        });
      }
      
      // Authenticate user
      const user = await userModel.authenticate(loginData.email, loginData.password);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }
      
      // Create session
      if (req.session) {
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email
        };
      }
      
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          username: user.username,
          email: user.email
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

  // Logout user
  logout(req: Request, res: Response) {
    // Clear session
    clearSession(req);
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }

  // Get current user
  getCurrentUser(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }
    
    return res.status(200).json({
      success: true,
      data: req.user
    });
  }
}

export default new UserController();
