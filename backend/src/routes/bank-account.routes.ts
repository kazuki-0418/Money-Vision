import express from "express";
import bankAccountController from "../controllers/bank-account.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Bank account routes
router.get("/", bankAccountController.getAccounts);
router.get("/refresh", bankAccountController.refreshBalances);
router.get("/:id", bankAccountController.getAccountById);

export default router;
