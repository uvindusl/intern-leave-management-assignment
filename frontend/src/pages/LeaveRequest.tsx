import { useState, useEffect } from 'react';
import { employeeService, leaveService } from '../services';
import type { Employee } from '../services';
import '../styles/LeaveRequest.css';

const LeaveRequest = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type: 'ANNUAL',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.end_date < formData.start_date) {
      setError('End date cannot be before start date');
      return;
    }

    setLoading(true);

    try {
      await leaveService.create({
        employee_id: parseInt(formData.employee_id),
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
      });
      setSuccess('Leave request submitted successfully');
      setFormData({
        employee_id: '',
        leave_type: 'ANNUAL',
        start_date: '',
        end_date: '',
        reason: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Submit Leave Request</h1>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="employee_id">Select Employee</label>
            <select
              id="employee_id"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
            >
              <option value="">Choose an employee</option>
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
              <option value="ANNUAL">Annual Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="MEDICAL">Medical Leave</option>
            </select>
          </div>

          <div className="form-row">
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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequest;
