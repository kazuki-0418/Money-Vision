import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import bankAccountRoutes from "./routes/bank-account.routes";
import transactionRoutes from "./routes/transaction.routes";
// Import routes
import userRoutes from "./routes/user.routes";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
    maxAge: 86400, // 24時間（秒単位）のプリフライトリクエストのキャッシュ
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORSエラー対策のプリフライト用レスポンスヘッダー
app.options("*", cors());

// Configure cookie session
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "secret-key"],
    maxAge: Number.parseInt(process.env.COOKIE_MAX_AGE || "86400000"), // 24 hours by default
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  }),
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/accounts", bankAccountRoutes);
app.use("/api/transactions", transactionRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Personal Finance Management API",
    version: "1.0.0",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

// Start server
app.listen(PORT, () => {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(`Server running on port ${PORT}`);
});

export default app;
