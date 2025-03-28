import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./components/pages/login";
import RegisterForm from "./components/pages/register";
import { useAuthManager } from "./hooks/auth";

function App() {
  const { isAuthenticated, isLoading } = useAuthManager();

  if (isLoading) {
    return <div>Loading application...</div>;
  }

  return (
    <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
      />
    </Routes>
  );
}

export default App;
