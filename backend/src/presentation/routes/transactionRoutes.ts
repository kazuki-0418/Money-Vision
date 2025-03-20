import { Router } from "express";
import { TransactionController } from "../controllers/TransactionController";

const router = Router();
const transactionController = new TransactionController();

router.get("/:accountId/history", (req, res) =>
  transactionController.getTransactionHistory(req, res),
);

export default router;
