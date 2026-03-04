import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.css';

function Notifications({ userRole }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh every 5 seconds for real-time notifications
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [userRole]);

  const fetchNotifications = async () => {
    try {
      const bookingsResponse = await axios.get('http://127.0.0.1:8000/api/bookings/');
      const bookings = bookingsResponse.data;
      
      // Get recent bookings (last 10)
      const recentBookings = bookings.slice(-10).reverse();
      
      const notifs = recentBookings.map(booking => ({
        id: booking.id,
        message: `New booking: Resource #${booking.resourceId} on ${booking.bookingDate} at ${booking.timeSlot}`,
        status: booking.status,
        time: new Date().toLocaleTimeString(),
        type: 'booking'
      }));
      
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => n.status === 'PENDING').length);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  return (
    <div className="notification-container">
      <button 
        className="notification-bell"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <span className="notification-count">{unreadCount} new</span>
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`notification-item ${notif.status === 'PENDING' ? 'unread' : ''}`}
                >
                  <div className="notification-icon">
                    {notif.status === 'PENDING' ? '🆕' : 
                     notif.status === 'APPROVED' ? '✅' : '❌'}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notif.message}</p>
                    <span className="notification-time">{notif.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
