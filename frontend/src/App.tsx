import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Goals } from "./components/pages/goals";
import { Home } from "./components/pages/home";
import LoginForm from "./components/pages/login";
import RegisterForm from "./components/pages/register";
import { Report } from "./components/pages/report";
import { Statistics } from "./components/pages/statistics";
import { Transaction } from "./components/pages/transaction";
import { MainLayout } from "./layout/MainLayout";

function App() {
  const navigate = useNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = tokenData.exp * 1000; // JWTのexpはUNIX秒なのでミリ秒に変換

        if (Date.now() >= expirationTime) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("token error:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <Routes>
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

      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
}

export default App;
