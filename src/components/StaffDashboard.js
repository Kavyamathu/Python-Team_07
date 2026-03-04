import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function StaffDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reason, setReason] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [activityModal, setActivityModal] = useState(null);

  useEffect(() => {
    fetchAllData();
    
    const interval = setInterval(() => {
      fetchAllData();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = () => {
    fetchPendingUsers();
    fetchPendingBookings();
    fetchAllUsers();
    fetchAllBookings();
  };

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/?status=PENDING_STAFF');
      setPendingUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch pending users');
    }
  };

  const fetchPendingBookings = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/bookings/');
      const pending = response.data.filter(b => b.status === 'PENDING');
      setPendingBookings(pending);
    } catch (err) {
      console.error('Failed to fetch bookings');
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

  const fetchAllBookings = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/bookings/');
      setAllBookings(response.data);
    } catch (err) {
      console.error('Failed to fetch bookings');
    }
  };

  const handleUserReview = async (userId, action) => {
    setError('');
    setSuccess('');

    if (action === 'reject' && !reason) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/users/${userId}/staff_review/`,
        { action, reason }
      );
      
      // Show success message with details
      const statusText = action === 'approve' ? '✅ Approved' : '❌ Rejected';
      setSuccess(`${statusText} - ${response.data.message}`);
      
      setReason('');
      setSelectedUser(null);
      
      // Immediately refresh all data
      await fetchAllData();
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Review failed');
    }
  };

  const handleBookingReview = async (bookingId, action) => {
    setError('');
    setSuccess('');

    // If rejecting, check for reason
    if (action === 'reject' && !reason) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      const booking = pendingBookings.find(b => b.id === bookingId);
      await axios.put(`http://127.0.0.1:8000/api/bookings/${bookingId}/`, {
        ...booking,
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        rejection_reason: action === 'reject' ? reason : null
      });
      
      // Show success message with details
      const statusText = action === 'approve' ? '✅ Approved' : '❌ Rejected';
      setSuccess(`${statusText} - Booking #${bookingId} has been ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      
      setReason('');
      setSelectedBooking(null);
      
      // Immediately refresh all data to update stats
      await fetchAllData();
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to update booking');
    }
  };

  const approvedBookings = allBookings.filter(b => b.status === 'APPROVED').length;
  const activeUsers = allUsers.filter(u => u.status === 'ACTIVE').length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Staff Dashboard</h1>
          <p>Manage registrations and bookings</p>
        </div>
        <div className="dashboard-date">
          <span>📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">👥</div>
          <div className="stat-details">
            <h3>{pendingUsers.length}</h3>
            <p>Pending Registrations</p>
          </div>
          <div className="stat-trend">
            <span className="trend-up">↗ New</span>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">📋</div>
          <div className="stat-details">
            <h3>{pendingBookings.length}</h3>
            <p>Pending Bookings</p>
          </div>
          <div className="stat-trend">
            <span className="trend-up">↗ Awaiting</span>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">✅</div>
          <div className="stat-details">
            <h3>{approvedBookings}</h3>
            <p>Approved Bookings</p>
          </div>
          <div className="stat-trend">
            <span className="trend-neutral">→ Total</span>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">👤</div>
          <div className="stat-details">
            <h3>{activeUsers}</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-trend">
            <span className="trend-neutral">→ Total</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Pending Users ({pendingUsers.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📋 Pending Bookings ({pendingBookings.length})
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="dashboard-content">
          <div className="overview-grid">
            <div className="overview-card">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div 
                  className="activity-item clickable"
                  onClick={() => setActivityModal('users')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="activity-icon">🆕</span>
                  <div>
                    <p>{pendingUsers.length} new registration(s) awaiting approval</p>
                    <span className="activity-time">Just now</span>
                  </div>
                </div>
                <div 
                  className="activity-item clickable"
                  onClick={() => setActivityModal('bookings')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="activity-icon">📅</span>
                  <div>
                    <p>{pendingBookings.length} booking(s) need review</p>
                    <span className="activity-time">Today</span>
                  </div>
                </div>
                <div 
                  className="activity-item clickable"
                  onClick={() => setActivityModal('approved')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="activity-icon">✅</span>
                  <div>
                    <p>{approvedBookings} booking(s) approved</p>
                    <span className="activity-time">This week</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="overview-card">
              <h3>Quick Stats</h3>
              <div className="quick-stats">
                <div className="quick-stat-item">
                  <span className="quick-stat-label">Total Users</span>
                  <span className="quick-stat-value">{allUsers.length}</span>
                </div>
                <div className="quick-stat-item">
                  <span className="quick-stat-label">Total Bookings</span>
                  <span className="quick-stat-value">{allBookings.length}</span>
                </div>
                <div className="quick-stat-item">
                  <span className="quick-stat-label">Approval Rate</span>
                  <span className="quick-stat-value">
                    {allBookings.length > 0 ? Math.round((approvedBookings / allBookings.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-card">
              <h3>Booking Status Distribution</h3>
              <div className="pie-chart">
                <div className="pie-chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ background: '#ff9800' }}></span>
                    <span>Pending: {pendingBookings.length}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ background: '#4caf50' }}></span>
                    <span>Approved: {approvedBookings}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ background: '#f44336' }}></span>
                    <span>Rejected: {allBookings.filter(b => b.status === 'REJECTED').length}</span>
                  </div>
                </div>
                <div className="pie-chart-visual">
                  {allBookings.length > 0 ? (
                    <>
                      <div 
                        style={{ 
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: `conic-gradient(
                            #ff9800 0% ${(pendingBookings.length / allBookings.length) * 100}%,
                            #4caf50 ${(pendingBookings.length / allBookings.length) * 100}% ${((pendingBookings.length + approvedBookings) / allBookings.length) * 100}%,
                            #f44336 ${((pendingBookings.length + approvedBookings) / allBookings.length) * 100}% 100%
                          )`
                        }}
                      ></div>
                      <div className="pie-center">
                        <span className="pie-total">{allBookings.length}</span>
                        <span className="pie-label">Total</span>
                      </div>
                    </>
                  ) : (
                    <div className="pie-center">
                      <span className="pie-label">No Data</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>Most Popular Resources</h3>
              <div className="bar-chart">
                {(() => {
                  const resourceCounts = {};
                  allBookings.forEach(b => {
                    resourceCounts[b.resourceId] = (resourceCounts[b.resourceId] || 0) + 1;
                  });
                  const topResources = Object.entries(resourceCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5);
                  const maxCount = Math.max(...topResources.map(r => r[1]), 1);

                  return topResources.length > 0 ? (
                    topResources.map(([resourceId, count]) => (
                      <div key={resourceId} className="bar-item">
                        <span className="bar-label">Resource #{resourceId}</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          ></div>
                          <span className="bar-value">{count}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', color: '#546e7a', padding: '2rem' }}>
                      No booking data available
                    </p>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="dashboard-content">
          <div className="card">
            <h3>Pending User Registrations</h3>
            {pendingUsers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">✨</div>
                <h3>All Caught Up!</h3>
                <p>No pending registrations at the moment</p>
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
                      <td>
                        <button 
                          onClick={() => handleUserReview(user.id, 'approve')}
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
                    <button onClick={() => handleUserReview(selectedUser, 'reject')}>
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
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="dashboard-content">
          <div className="card">
            <h3>Pending Bookings</h3>
            {pendingBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">✨</div>
                <h3>All Caught Up!</h3>
                <p>No pending bookings at the moment</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Resource</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>User #{booking.userId}</td>
                      <td>Resource #{booking.resourceId}</td>
                      <td>{booking.bookingDate}</td>
                      <td><span className="badge badge-warning">{booking.timeSlot}</span></td>
                      <td>
                        <button 
                          onClick={() => handleBookingReview(booking.id, 'approve')}
                          style={{ background: 'linear-gradient(135deg, #00897b 0%, #00695c 100%)', marginRight: '0.5rem' }}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          onClick={() => setSelectedBooking(booking.id)}
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
          </div>

          {selectedBooking && (
            <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Reject Booking</h3>
                <p style={{ color: '#546e7a', marginBottom: '1rem' }}>
                  Please provide a reason for rejecting this booking request.
                </p>
                <div className="form-group">
                  <label>Reason for Rejection</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Resource not available, Time slot conflict, Maintenance scheduled..."
                    rows="4"
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button onClick={() => handleBookingReview(selectedBooking, 'reject')}>
                    Confirm Rejection
                  </button>
                  <button onClick={() => { setSelectedBooking(null); setReason(''); }} style={{ background: '#546e7a' }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity Detail Modal */}
      {activityModal && (
        <div className="modal-overlay" onClick={() => setActivityModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <h3>
              {activityModal === 'users' && '🆕 Pending User Registrations'}
              {activityModal === 'bookings' && '📅 Pending Bookings'}
              {activityModal === 'approved' && '✅ Approved Bookings'}
            </h3>
            
            {activityModal === 'users' && (
              <div>
                {pendingUsers.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#546e7a', padding: '2rem' }}>
                    No pending user registrations
                  </p>
                ) : (
                  <table style={{ marginTop: '1rem' }}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.country_code} {user.phone}</td>
                          <td><span className="badge badge-pending">{user.role}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activityModal === 'bookings' && (
              <div>
                {pendingBookings.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#546e7a', padding: '2rem' }}>
                    No pending bookings
                  </p>
                ) : (
                  <table style={{ marginTop: '1rem' }}>
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Resource ID</th>
                        <th>Date</th>
                        <th>Time Slot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingBookings.map(booking => (
                        <tr key={booking.id}>
                          <td>User #{booking.userId}</td>
                          <td>Resource #{booking.resourceId}</td>
                          <td>{booking.bookingDate}</td>
                          <td><span className="badge badge-warning">{booking.timeSlot}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activityModal === 'approved' && (
              <div>
                {approvedBookings === 0 ? (
                  <p style={{ textAlign: 'center', color: '#546e7a', padding: '2rem' }}>
                    No approved bookings yet
                  </p>
                ) : (
                  <table style={{ marginTop: '1rem' }}>
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Resource ID</th>
                        <th>Date</th>
                        <th>Time Slot</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allBookings.filter(b => b.status === 'APPROVED').map(booking => (
                        <tr key={booking.id}>
                          <td>User #{booking.userId}</td>
                          <td>Resource #{booking.resourceId}</td>
                          <td>{booking.bookingDate}</td>
                          <td>{booking.timeSlot}</td>
                          <td><span className="badge badge-success">APPROVED</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button onClick={() => setActivityModal(null)} style={{ background: '#00897b' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;
