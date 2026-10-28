import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import { employeeApi, leaveApi } from "../api/client";
import { Employee } from "../types";
import "../styles/EmployeesPage.css";

const SubmitLeavePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    leave_type: "ANNUAL",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeApi.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.end_date < formData.start_date) {
      setError("End date cannot be before start date");
      return;
    }

    setLoading(true);

    try {
      await leaveApi.create({
        employee_id: parseInt(formData.employee_id),
        leave_type: formData.leave_type as "ANNUAL" | "CASUAL" | "MEDICAL",
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
      });
      setSuccess("Leave request submitted successfully!");
      setFormData({
        employee_id: "",
        leave_type: "ANNUAL",
        start_date: "",
        end_date: "",
        reason: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <Header />
      <div className="page-container">
        <h1>Submit Leave Request</h1>
        <div className="form-container">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="employee_id">Employee</label>
              <select
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} - {emp.department}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="leave_type">Leave Type</label>
              <select
                id="leave_type"
                name="leave_type"
                value={formData.leave_type}
                onChange={handleChange}
                required
              >
                <option value="ANNUAL">Annual</option>
                <option value="CASUAL">Casual</option>
                <option value="MEDICAL">Medical</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reason">Reason</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitLeavePage;
