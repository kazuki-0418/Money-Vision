import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import env from "./src/infrastructure/config/env";

import accountRoutes from "./src/presentation/routes/accountRoutes";
import transactionRoutes from "./src/presentation/routes/transactionRoutes";

const app = express();

// ミドルウェア
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// ルート
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

// エラーハンドリング
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// サーバー起動
const PORT = env.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
