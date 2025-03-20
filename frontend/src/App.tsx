import { Route, Routes } from "react-router-dom";
import { Goals } from "./components/pages/goals";
import { Home } from "./components/pages/home";
import { Report } from "./components/pages/report";
import { Statistics } from "./components/pages/statistics";
import { Transaction } from "./components/pages/transaction";
import { MainLayout } from "./layout/MainLayout";

function App() {
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
    </Routes>
  );
}

export default App;
