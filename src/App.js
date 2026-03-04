import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import ResourceManagement from './components/ResourceManagement';
import BookingManagement from './components/BookingManagement';
import StaffDashboard from './components/StaffDashboard';
import AdminDashboard from './components/AdminDashboard';
import Notifications from './components/Notifications';
import MyBookings from './components/MyBookings';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>Campus Resource Management System</h1>
          {user && (
            <div className="nav-links">
              {user.role === 'STAFF' && <Link to="/staff-dashboard">Staff Dashboard</Link>}
              {user.role === 'ADMIN' && <Link to="/admin-dashboard">Admin Dashboard</Link>}
              <Link to="/my-bookings">My Bookings</Link>
              <Link to="/users">Users</Link>
              <Link to="/resources">Resources</Link>
              <Link to="/bookings">Bookings</Link>
              <Notifications userRole={user.role} />
              <button onClick={() => setUser(null)}>Logout</button>
            </div>
          )}
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Login setUser={setUser} />} />
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/my-bookings" element={<MyBookings currentUser={user} />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/resources" element={<ResourceManagement />} />
            <Route path="/bookings" element={<BookingManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
