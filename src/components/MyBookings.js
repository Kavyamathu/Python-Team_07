import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyBookings.css';

function MyBookings({ currentUser }) {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
    
    const interval = setInterval(() => {
      fetchMyBookings();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [currentUser]);

  const fetchMyBookings = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/bookings/');
      // Filter bookings for current user
      const myBookings = response.data.filter(b => b.userId === currentUser?.id);
      setBookings(myBookings);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const getResourceName = async (resourceId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/resources/${resourceId}/`);
      return response.data.name;
    } catch (err) {
      return `Resource #${resourceId}`;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'ALL') return true;
    return booking.status === filter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': { class: 'badge-pending', icon: '⏳', text: 'Pending' },
      'APPROVED': { class: 'badge-approved', icon: '✅', text: 'Approved' },
      'REJECTED': { class: 'badge-rejected', icon: '❌', text: 'Rejected' }
    };
    return badges[status] || badges['PENDING'];
  };

  return (
    <div className="my-bookings-container">
      <div className="my-bookings-header">
        <div>
          <h1>My Bookings</h1>
          <p>Track all your resource bookings</p>
        </div>
        <div className="booking-stats">
          <div className="stat-mini">
            <span className="stat-mini-value">{bookings.length}</span>
            <span className="stat-mini-label">Total</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini-value">{bookings.filter(b => b.status === 'PENDING').length}</span>
            <span className="stat-mini-label">Pending</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini-value">{bookings.filter(b => b.status === 'APPROVED').length}</span>
            <span className="stat-mini-label">Approved</span>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All Bookings ({bookings.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'PENDING' ? 'active' : ''}`}
          onClick={() => setFilter('PENDING')}
        >
          ⏳ Pending ({bookings.filter(b => b.status === 'PENDING').length})
        </button>
        <button 
          className={`filter-tab ${filter === 'APPROVED' ? 'active' : ''}`}
          onClick={() => setFilter('APPROVED')}
        >
          ✅ Approved ({bookings.filter(b => b.status === 'APPROVED').length})
        </button>
        <button 
          className={`filter-tab ${filter === 'REJECTED' ? 'active' : ''}`}
          onClick={() => setFilter('REJECTED')}
        >
          ❌ Rejected ({bookings.filter(b => b.status === 'REJECTED').length})
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading your bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>No Bookings Found</h3>
          <p>{filter === 'ALL' ? 'You haven\'t made any bookings yet' : `No ${filter.toLowerCase()} bookings`}</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map(booking => {
            const badge = getStatusBadge(booking.status);
            return (
              <div key={booking.id} className={`booking-card ${booking.status.toLowerCase()}`}>
                <div className="booking-card-header">
                  <span className={`status-badge ${badge.class}`}>
                    {badge.icon} {badge.text}
                  </span>
                  <span className="booking-id">#{booking.id}</span>
                </div>
                
                <div className="booking-card-body">
                  <div className="booking-detail">
                    <span className="detail-icon">🏢</span>
                    <div>
                      <span className="detail-label">Resource</span>
                      <span className="detail-value">Resource #{booking.resourceId}</span>
                    </div>
                  </div>
                  
                  <div className="booking-detail">
                    <span className="detail-icon">📅</span>
                    <div>
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{booking.bookingDate}</span>
                    </div>
                  </div>
                  
                  <div className="booking-detail">
                    <span className="detail-icon">⏰</span>
                    <div>
                      <span className="detail-label">Time Slot</span>
                      <span className="detail-value">{booking.timeSlot}</span>
                    </div>
                  </div>

                  {booking.status === 'REJECTED' && booking.rejection_reason && (
                    <div className="rejection-reason">
                      <span className="reason-icon">💬</span>
                      <div>
                        <span className="reason-label">Rejection Reason:</span>
                        <p className="reason-text">{booking.rejection_reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
