// src/services/supabase/supabase-client.ts

import { SupabaseClient, createClient } from "@supabase/supabase-js";

export const getSupabaseClient = (adminMode = false): SupabaseClient => {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  // adminModeがtrueの場合はservice_roleキーを使用し、falseの場合は通常のキーを使用
  const supabaseKey = adminMode
    ? process.env.SUPABASE_SERVICE_KEY || ""
    : process.env.SUPABASE_KEY || "";

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// 共通エラーハンドリング関数
export const handleSupabaseError = (error: Error, operation: string): void => {
  console.error(`Supabase Error (${operation}):`, error);
};
