import { useState, useEffect } from 'react';
import { leaveService } from '../services';
import { LeaveRequest } from '../services';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await leaveService.getAll();
      setLeaves(response.data);
    } catch (err) {
      console.error('Error fetching leaves:', err);
      setError('Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setError('');
    setSuccess('');
    try {
      await leaveService.approve(id);
      setSuccess('Leave request approved');
      fetchLeaves();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to approve');
    }
  };

  const openRejectModal = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
    setRejectionReason('');
  };

  const handleReject = async () => {
    if (!selectedId || !rejectionReason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await leaveService.reject(selectedId, rejectionReason);
      setSuccess('Leave request rejected');
      setShowModal(false);
      setSelectedId(null);
      fetchLeaves();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to reject');
    }
  };

  const getBadgeClass = (status: string) => {
    if (status === 'APPROVED') return 'badge badge-approved';
    if (status === 'REJECTED') return 'badge badge-rejected';
    return 'badge badge-pending';
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Admin Panel - Leave Requests</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Rejection Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.id}</td>
                    <td>{leave.employee?.name || `ID: ${leave.employee_id}`}</td>
                    <td>{leave.employee?.department || '-'}</td>
                    <td>{leave.leave_type}</td>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={getBadgeClass(leave.status)}>{leave.status}</span>
                    </td>
                    <td>{leave.rejection_reason || '-'}</td>
                    <td>
                      {leave.status === 'PENDING' && (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleApprove(leave.id)}
                            className="btn btn-success"
                            style={{ padding: '0.375rem 0.75rem' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(leave.id)}
                            className="btn btn-danger"
                            style={{ padding: '0.375rem 0.75rem' }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leaves.length === 0 && <p className="empty-state">No leave requests found</p>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reject Leave Request</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="reason">Rejection Reason</label>
                <textarea
                  id="reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleReject}>
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
