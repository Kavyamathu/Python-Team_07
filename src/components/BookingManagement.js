import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    resourceId: '',
    bookingDate: '',
    timeSlot: '',
    status: 'PENDING'
  });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [showAvailability, setShowAvailability] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchUsers();
    fetchResources();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/bookings/');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const fetchResources = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/resources/');
      setResources(response.data);
    } catch (err) {
      console.error('Failed to fetch resources');
    }
  };

  const checkAvailability = () => {
    if (!formData.resourceId || !formData.bookingDate) {
      setError('Please select resource and date first');
      return;
    }

    const booked = bookings.filter(
      b => b.resourceId === parseInt(formData.resourceId) && 
           b.bookingDate === formData.bookingDate &&
           b.status !== 'REJECTED'
    );
    
    setBookedSlots(booked.map(b => b.timeSlot));
    setShowAvailability(true);
  };

  const commonTimeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editing) {
        await axios.put(`http://127.0.0.1:8000/api/bookings/${editing}/`, formData);
        setSuccess('Booking updated successfully');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/bookings/', formData);
        const userName = getUserName(formData.userId);
        const resourceName = getResourceName(formData.resourceId);
        setSuccess(`✅ Booking Confirmed! ${userName} has booked ${resourceName} on ${formData.bookingDate} at ${formData.timeSlot}. Status: Pending Staff Approval.`);
      }
      
      setFormData({ userId: '', resourceId: '', bookingDate: '', timeSlot: '', status: 'PENDING' });
      setEditing(null);
      fetchBookings();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Operation failed';
      setError(errorMsg);
    }
  };

  const handleEdit = (booking) => {
    setFormData(booking);
    setEditing(booking.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/bookings/${id}/`);
        setSuccess('Booking deleted successfully');
        fetchBookings();
      } catch (err) {
        setError('Failed to delete booking');
      }
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId;
  };

  const getResourceName = (resourceId) => {
    const resource = resources.find(r => r.id === resourceId);
    return resource ? resource.name : resourceId;
  };

  return (
    <div>
      <div className="card">
        <h2>Booking Management</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User</label>
            <select
              value={formData.userId}
              onChange={(e) => setFormData({...formData, userId: e.target.value})}
              required
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Resource</label>
            <select
              value={formData.resourceId}
              onChange={(e) => setFormData({...formData, resourceId: e.target.value})}
              required
            >
              <option value="">Select Resource</option>
              {resources.map(resource => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} ({resource.type})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Booking Date</label>
            <input
              type="date"
              value={formData.bookingDate}
              onChange={(e) => {
                setFormData({...formData, bookingDate: e.target.value});
                setShowAvailability(false);
              }}
              required
            />
          </div>

          {formData.resourceId && formData.bookingDate && (
            <div style={{ marginBottom: '1.5rem' }}>
              <button 
                type="button" 
                onClick={checkAvailability}
                style={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)' }}
              >
                🔍 Check Availability
              </button>
            </div>
          )}

          {showAvailability && (
            <div style={{ 
              marginBottom: '1.5rem', 
              padding: '1.5rem', 
              background: '#f1f8f7', 
              borderRadius: '12px',
              border: '2px solid #b2dfdb'
            }}>
              <h4 style={{ color: '#00695c', marginBottom: '1rem' }}>
                Available Time Slots for {formData.bookingDate}
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                gap: '0.75rem' 
              }}>
                {commonTimeSlots.map(slot => {
                  const isBooked = bookedSlots.includes(slot);
                  return (
                    <div
                      key={slot}
                      onClick={() => !isBooked && setFormData({...formData, timeSlot: slot})}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        background: isBooked ? '#ffebee' : 
                                   formData.timeSlot === slot ? '#e0f2f1' : 'white',
                        border: `2px solid ${isBooked ? '#f44336' : 
                                formData.timeSlot === slot ? '#00897b' : '#e0e0e0'}`,
                        color: isBooked ? '#c62828' : 
                               formData.timeSlot === slot ? '#00695c' : '#546e7a',
                        fontWeight: formData.timeSlot === slot ? '600' : '500',
                        transition: 'all 0.3s'
                      }}
                    >
                      {isBooked ? '❌' : formData.timeSlot === slot ? '✓' : '⏰'} {slot}
                    </div>
                  );
                })}
              </div>
              <p style={{ 
                marginTop: '1rem', 
                fontSize: '0.9rem', 
                color: '#546e7a',
                textAlign: 'center'
              }}>
                ✅ Available | ❌ Booked | Click to select
              </p>
            </div>
          )}

          <div className="form-group">
            <label>Time Slot</label>
            <select
              value={formData.timeSlot}
              onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
              required
            >
              <option value="">Select Time Slot</option>
              <option value="09:00-10:00">09:00 - 10:00 AM</option>
              <option value="10:00-11:00">10:00 - 11:00 AM</option>
              <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
              <option value="12:00-13:00">12:00 - 01:00 PM</option>
              <option value="13:00-14:00">01:00 - 02:00 PM</option>
              <option value="14:00-15:00">02:00 - 03:00 PM</option>
              <option value="15:00-16:00">03:00 - 04:00 PM</option>
              <option value="16:00-17:00">04:00 - 05:00 PM</option>
              <option value="17:00-18:00">05:00 - 06:00 PM</option>
            </select>
          </div>

          {/* Status field removed - auto set to PENDING */}

          <button type="submit">{editing ? 'Update' : 'Create'} Booking</button>
          {editing && (
            <button type="button" onClick={() => {
              setEditing(null);
              setFormData({ userId: '', resourceId: '', bookingDate: '', timeSlot: '', status: 'PENDING' });
            }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <h3>Bookings List</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Resource</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{getUserName(booking.userId)}</td>
                <td>{getResourceName(booking.resourceId)}</td>
                <td>{booking.bookingDate}</td>
                <td>{booking.timeSlot}</td>
                <td>{booking.status}</td>
                <td>
                  <button onClick={() => handleEdit(booking)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(booking.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingManagement;
