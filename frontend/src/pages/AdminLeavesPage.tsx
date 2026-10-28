import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import { leaveApi } from "../api/client";
import { LeaveRequest } from "../types";
import "../styles/EmployeesPage.css";

const RejectModal = ({
  isOpen,
  onClose,
  onReject,
}: {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onReject(reason);
      setReason("");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Reject Leave Request</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rejection_reason">Rejection Reason *</label>
            <textarea
              id="rejection_reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="reject-btn">
              Reject
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminLeavesPage = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<number | null>(null);

  const fetchLeaves = async () => {
    try {
      const response = await leaveApi.getAll();
      setLeaves(response.data);
    } catch (err) {
      console.error("Failed to fetch leaves", err);
      setError("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApprove = async (id: number) => {
    setError("");
    setSuccess("");
    try {
      await leaveApi.approve(id);
      setSuccess("Leave request approved successfully!");
      fetchLeaves();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to approve leave request");
    }
  };

  const handleRejectClick = (id: number) => {
    setSelectedLeaveId(id);
    setRejectModalOpen(true);
  };

  const handleReject = async (reason: string) => {
    if (selectedLeaveId) {
      setError("");
      setSuccess("");
      try {
        await leaveApi.reject(selectedLeaveId, reason);
        setSuccess("Leave request rejected successfully!");
        setRejectModalOpen(false);
        setSelectedLeaveId(null);
        fetchLeaves();
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to reject leave request");
      }
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "status-approved";
      case "REJECTED":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  return (
    <div>
      <Header />
      <div className="page-container">
        <h1>Admin - Leave Requests</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="list-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Leave Type</th>
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
                    <td>{leave.employee?.name || leave.employee_id}</td>
                    <td>{leave.employee?.department || "-"}</td>
                    <td>{leave.leave_type}</td>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>{leave.rejection_reason || "-"}</td>
                    <td>
                      {leave.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(leave.id)}
                            className="action-btn approve-btn"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectClick(leave.id)}
                            className="action-btn reject-btn"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leaves.length === 0 && <p className="no-data">No leave requests found</p>}
          </div>
        )}
      </div>
      <RejectModal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedLeaveId(null);
        }}
        onReject={handleReject}
      />
    </div>
  );
};

export default AdminLeavesPage;
