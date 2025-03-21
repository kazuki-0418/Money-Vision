import express from "express";
import transactionController from "../controllers/transaction.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Transaction routes
router.get("/", transactionController.getTransactions);
router.get("/search", transactionController.searchTransactions);
router.get("/account/:accountId", transactionController.getAccountTransactions);
router.get("/:id", transactionController.getTransaction);
router.post("/", transactionController.createTransaction);
router.put("/:id", transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

export default router;
