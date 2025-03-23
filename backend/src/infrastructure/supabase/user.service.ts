// src/services/supabase/user.service.ts

import { User, UserRegistration } from "../../types/users";
import { getSupabaseClient, handleSupabaseError } from "./supabase-client";

export const UserService = {
  async getUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await getSupabaseClient()
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        handleSupabaseError(error, "getUser");
        return null;
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "getUser");
        return null;
      }
      return null;
    }
  },

  async createUser(userData: UserRegistration): Promise<User | null> {
    try {
      // 管理者権限でSupabaseにアクセス（RLSをバイパス）
      const { data, error } = await getSupabaseClient()
        .from("users")
        .insert([userData])
        .select()
        .single();

      if (error) {
        handleSupabaseError(error, "createUser");
        return null;
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "createUser");
        return null;
      }
      return null;
    }
  },

  //   async updateUser(userId: string, userData: UserUpdate): Promise<User | null> {
  //     try {
  //       const { data, error } = await getSupabaseClient()
  //         .from("users")
  //         .update(userData)
  //         .eq("id", userId)
  //         .select()
  //         .single();

  //       if (error) {
  //         handleSupabaseError(error, "updateUser");
  //         return null;
  //       }

  //       return data;
  //     } catch (error) {
  //       handleSupabaseError(error, "updateUser");
  //       return null;
  //     }
  //   },

  //   async deleteUser(userId: string): Promise<boolean> {
  //     try {
  //       const { error } = await getSupabaseClient().from("users").delete().eq("id", userId);

  //       if (error) {
  //         handleSupabaseError(error, "deleteUser");
  //         return false;
  //       }

  //       return true;
  //     } catch (error) {
  //       handleSupabaseError(error, "deleteUser");
  //       return false;
  //     }
  //   },
};
