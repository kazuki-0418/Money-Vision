import { NextFunction, Request, Response } from "express";

// Authentication middleware to protect routes
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check if user is logged in (exists in session)
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  // Attach user to request object
  req.user = req.session.user;

  // Continue to next middleware or controller
  next();
};

// Utility function to clear session (for logout)
export const clearSession = (req: Request) => {
  if (req.session) {
    req.session = null;
  }
};
