import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    // Add more fields as needed
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5003/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          name: res.data.name || '',
          date: res.data.date || '',
          location: res.data.location || '',
          description: res.data.description || '',
        });
      } catch (err) {
        setError('Failed to load event details.');
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5003/api/events/${eventId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/EventsManagementPage/${eventId}`);
    } catch (err) {
      setError('Failed to save changes.');
    }
    setSaving(false);
  };

  if (loading) return <div style={{ padding: 40 }}>Loading event...</div>;

  return (
    <div className="edit-event-container" style={{ maxWidth: 540, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <h2>Edit Event</h2>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required className="edit-input" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Date</label>
          <input name="date" value={formData.date} onChange={handleChange} type="date" required className="edit-input" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Location</label>
          <input name="location" value={formData.location} onChange={handleChange} required className="edit-input" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="edit-input" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        </div>
        <button type="submit" className="primary-btn" style={{ width: '100%', padding: 12, background: '#441752', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 500 }} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;
