import { Routes, Route, Navigate } from "react-router-dom";
import EmployeesPage from "./pages/EmployeesPage";
import SubmitLeavePage from "./pages/SubmitLeavePage";
import AdminLeavesPage from "./pages/AdminLeavesPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/employees" replace />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/submit-leave" element={<SubmitLeavePage />} />
      <Route path="/admin/leaves" element={<AdminLeavesPage />} />
    </Routes>
  );
}

export default App;
