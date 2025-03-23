import { Navigate, Route, Routes } from "react-router-dom";
import { Goals } from "./components/pages/goals";
import { Home } from "./components/pages/home";
import LoginForm from "./components/pages/login";
import RegisterForm from "./components/pages/register";
import { Report } from "./components/pages/report";
import { Statistics } from "./components/pages/statistics";
import { Transaction } from "./components/pages/transaction";
import { useAuthManager } from "./hooks/auth";
import { MainLayout } from "./layout/MainLayout";

function App() {
  const { isAuthenticated, isLoading } = useAuthManager();

  if (isLoading) {
    return <div>Loading application...</div>;
  }

  return (
    <Routes>
      {isAuthenticated ? (
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/statistic" element={<Statistics />} />
          <Route path="/report" element={<Report />} />
          <Route path="/notifications" element={<Home />} />
          <Route path="/settings" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Route>
      ) : (
        // 認証されていない場合、ログインページにリダイレクト
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}

      <Route path="/register" element={<RegisterForm />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
      />
    </Routes>
  );
}

export default App;
