import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import EmployeeForm from "../components/employees/EmployeeForm";
import EmployeeList from "../components/employees/EmployeeList";
import { employeeApi } from "../api/client";
import { Employee } from "../types";
import "../styles/EmployeesPage.css";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const response = await employeeApi.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
      <Header />
      <div className="page-container">
        <h1>Employee Management</h1>
        <EmployeeForm onEmployeeAdded={fetchEmployees} />
        {loading ? <p>Loading...</p> : <EmployeeList employees={employees} />}
      </div>
    </div>
  );
};

export default EmployeesPage;
