import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResourceManagement() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'LAB',
    capacity: '',
    status: 'AVAILABLE'
  });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/resources/');
      setResources(response.data);
    } catch (err) {
      setError('Failed to fetch resources');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editing) {
        await axios.put(`http://127.0.0.1:8000/api/resources/${editing}/`, formData);
        setSuccess('Resource updated successfully');
      } else {
        await axios.post('http://127.0.0.1:8000/api/resources/', formData);
        setSuccess('Resource created successfully! Redirecting to Bookings...');
        setTimeout(() => {
          navigate('/bookings');
        }, 1500);
      }
      
      setFormData({ name: '', type: 'LAB', capacity: '', status: 'AVAILABLE' });
      setEditing(null);
      fetchResources();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (resource) => {
    setFormData(resource);
    setEditing(resource.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/resources/${id}/`);
        setSuccess('Resource deleted successfully');
        fetchResources();
      } catch (err) {
        setError('Failed to delete resource');
      }
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Resource Management</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <select
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            >
              <option value="">Select Resource</option>
              
              <optgroup label="Computer Labs">
                <option value="Computer Lab 1">Computer Lab 1</option>
                <option value="Computer Lab 2">Computer Lab 2</option>
                <option value="Computer Lab 3">Computer Lab 3</option>
                <option value="Computer Lab 4">Computer Lab 4</option>
                <option value="Advanced Computing Lab">Advanced Computing Lab</option>
              </optgroup>
              
              <optgroup label="Classrooms">
                <option value="Classroom A101">Classroom A101</option>
                <option value="Classroom A102">Classroom A102</option>
                <option value="Classroom B201">Classroom B201</option>
                <option value="Classroom B202">Classroom B202</option>
                <option value="Smart Classroom 1">Smart Classroom 1</option>
                <option value="Smart Classroom 2">Smart Classroom 2</option>
              </optgroup>
              
              <optgroup label="Event Halls">
                <option value="Main Auditorium">Main Auditorium</option>
                <option value="Seminar Hall 1">Seminar Hall 1</option>
                <option value="Seminar Hall 2">Seminar Hall 2</option>
                <option value="Conference Room">Conference Room</option>
                <option value="Mini Auditorium">Mini Auditorium</option>
              </optgroup>
              
              <optgroup label="Specialized Labs">
                <option value="Physics Lab">Physics Lab</option>
                <option value="Chemistry Lab">Chemistry Lab</option>
                <option value="Biology Lab">Biology Lab</option>
                <option value="Electronics Lab">Electronics Lab</option>
                <option value="Robotics Lab">Robotics Lab</option>
              </optgroup>
              
              <optgroup label="Sports Facilities">
                <option value="Indoor Stadium">Indoor Stadium</option>
                <option value="Outdoor Ground">Outdoor Ground</option>
                <option value="Basketball Court">Basketball Court</option>
                <option value="Badminton Court">Badminton Court</option>
              </optgroup>
            </select>
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="LAB">Lab</option>
              <option value="CLASSROOM">Classroom</option>
              <option value="EVENT_HALL">Event Hall</option>
            </select>
          </div>

          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

          <button type="submit">{editing ? 'Update' : 'Create'} Resource</button>
          {editing && (
            <button type="button" onClick={() => {
              setEditing(null);
              setFormData({ name: '', type: 'LAB', capacity: '', status: 'AVAILABLE' });
            }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <h3>Resources List</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(resource => (
              <tr key={resource.id}>
                <td>{resource.id}</td>
                <td>{resource.name}</td>
                <td>{resource.type}</td>
                <td>{resource.capacity}</td>
                <td>{resource.status}</td>
                <td>
                  <button onClick={() => handleEdit(resource)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(resource.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResourceManagement;
