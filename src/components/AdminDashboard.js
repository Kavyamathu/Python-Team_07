import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reason, setReason] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
    fetchAllUsers();
    
    const interval = setInterval(() => {
      fetchPendingUsers();
      fetchAllUsers();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/?status=PENDING_ADMIN');
      setPendingUsers(response.data);
    } catch (err) {
      setError('Failed to fetch pending users');
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/');
      setAllUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleReview = async (userId, action) => {
    setError('');
    setSuccess('');

    if (action === 'reject' && !reason) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/users/${userId}/admin_review/`,
        { action, reason }
      );
      setSuccess(response.data.message);
      setReason('');
      setSelectedUser(null);
      fetchPendingUsers();
      fetchAllUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Review failed');
    }
  };

  const activeUsers = allUsers.filter(u => u.status === 'ACTIVE').length;
  const pendingStaff = allUsers.filter(u => u.status === 'PENDING_STAFF').length;
  const totalUsers = allUsers.length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Final approval for user registrations</p>
        </div>
        <div className="dashboard-date">
          <span>📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">⏳</div>
          <div className="stat-details">
            <h3>{pendingUsers.length}</h3>
            <p>Awaiting Final Approval</p>
          </div>
          <div className="stat-trend">
            <span className="trend-up">↗ New</span>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">✅</div>
          <div className="stat-details">
            <h3>{activeUsers}</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-trend">
            <span className="trend-neutral">→ Total</span>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">📋</div>
          <div className="stat-details">
            <h3>{pendingStaff}</h3>
            <p>Pending Staff Review</p>
          </div>
          <div className="stat-trend">
            <span className="trend-neutral">→ Waiting</span>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">👥</div>
          <div className="stat-details">
            <h3>{totalUsers}</h3>
            <p>Total Registrations</p>
          </div>
          <div className="stat-trend">
            <span className="trend-neutral">→ All Time</span>
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="dashboard-content">
        <div className="card">
          <h3>Pending Final Approvals</h3>
          {pendingUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✨</div>
              <h3>All Caught Up!</h3>
              <p>No pending approvals at the moment</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.country_code} {user.phone}</td>
                    <td><span className="badge badge-pending">{user.role}</span></td>
                    <td>{user.district}, {user.state}</td>
                    <td>
                      <span className="badge badge-approved">
                        Staff Approved
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleReview(user.id, 'approve')}
                        style={{ background: 'linear-gradient(135deg, #00897b 0%, #00695c 100%)', marginRight: '0.5rem' }}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        onClick={() => setSelectedUser(user.id)}
                        className="delete"
                      >
                        ✗ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedUser && (
            <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Reject User Registration</h3>
                <div className="form-group">
                  <label>Reason for Rejection</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason..."
                    rows="4"
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button onClick={() => handleReview(selectedUser, 'reject')}>
                    Confirm Rejection
                  </button>
                  <button onClick={() => { setSelectedUser(null); setReason(''); }} style={{ background: '#546e7a' }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
