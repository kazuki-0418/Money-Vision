// src/hooks/useAuthManager.ts
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { checkAuthStatus } from "../api/auth";

// 認証状態のキャッシュ時間 (5分)
const AUTH_CACHE_TIME = 5 * 60 * 1000;

interface AuthState {
  isAuthenticated: boolean | null;
  lastChecked: number;
}

// アプリケーション全体で共有する認証状態
let authState: AuthState = {
  isAuthenticated: null,
  lastChecked: 0,
};

export const useAuthManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(authState.isAuthenticated);
  const [isLoading, setIsLoading] = useState<boolean>(authState.isAuthenticated === null);
  const location = useLocation();

  const checkAuth = useCallback(async (force = false) => {
    const now = Date.now();

    // キャッシュが有効であれば使用
    if (
      !force &&
      authState.isAuthenticated !== null &&
      now - authState.lastChecked < AUTH_CACHE_TIME
    ) {
      setIsAuthenticated(authState.isAuthenticated);
      setIsLoading(false);
      return authState.isAuthenticated;
    }

    // 認証状態を再確認
    setIsLoading(true);
    try {
      const status = await checkAuthStatus();

      // グローバル状態と内部状態を更新
      authState = { isAuthenticated: status, lastChecked: now };
      setIsAuthenticated(status);

      return status;
    } catch (error) {
      console.error("認証確認エラー:", error);
      authState = { isAuthenticated: false, lastChecked: now };
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const init = async () => {
      const authStatus = await checkAuth();
      if (
        authStatus === false &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    };
    if (location.pathname === "/login") {
      setIsLoading(false);
      if (authState.isAuthenticated === true) {
        window.location.href = "/";
      }

      return;
    }
    init();
  }, []);

  const login = () => {
    authState = { isAuthenticated: true, lastChecked: Date.now() };
    setIsAuthenticated(true);
  };

  const logout = useCallback(() => {
    authState = { isAuthenticated: false, lastChecked: Date.now() };
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    checkAuth,
    login,
    logout,
  };
};
