import { useState, useEffect } from 'react';
import { employeeService } from '../services';
import { Employee } from '../services';
import '../styles/EmployeeManagement.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', department: '' });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await employeeService.create(formData);
      setSuccess('Employee created successfully');
      setFormData({ name: '', email: '', department: '' });
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Employee Management</h1>

      <div className="card">
        <h2 className="card-title">Add New Employee</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Employee'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="card-title">Employee List</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {employees.length === 0 && <p className="empty-state">No employees found</p>}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
