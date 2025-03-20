import dotenv from "dotenv";
dotenv.config();

export default {
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_KEY || "",
  port: process.env.PORT || 3000,
  bankApiUrl: process.env.BANK_API_URL || "https://bank-api-mock.com/api",
  bankApiKey: process.env.BANK_API_KEY || "",
};
