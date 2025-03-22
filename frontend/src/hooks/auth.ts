// hooks/useAuth.js
import { useState } from "react";
import { loginApi, logoutApi, registerApi } from "../api/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const login = async (credentials: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError("");
    try {
      const response = await loginApi(credentials);
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "ログインに失敗しました");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutApi();
      localStorage.removeItem("token");
      setUser(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "ログアウト中にエラーが発生しました");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError("");
    try {
      const response = await registerApi(userData);
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "ユーザー登録に失敗しました");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
  };
};
