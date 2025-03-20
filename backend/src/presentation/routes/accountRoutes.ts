import { Router } from "express";
import { AccountController } from "../controllers/AccountController";

const router = Router();
const accountController = new AccountController();

router.get("/:accountId/balance", (req, res) => accountController.getAccountBalance(req, res));
router.get("/user/:userId", (req, res) => accountController.getUserAccounts(req, res));

export default router;
