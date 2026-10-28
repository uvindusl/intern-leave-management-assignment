import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import EmployeeManagement from './pages/EmployeeManagement';
import LeaveRequest from './pages/LeaveRequest';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeeManagement />} />
          <Route path="/leave-request" element={<LeaveRequest />} />
          <Route path="/admin/leaves" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/employees" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
