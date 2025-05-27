import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const EditTaskPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Get eventId from query param if present
  const eventId = new URLSearchParams(location.search).get('eventId');

  const [activeNav, setActiveNav] = useState('Events');
  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Suppliers', path: '/SuppliersProfile' }
  ];
  const userNavItems = [
    { name: 'My Work', path: '/MyWork' },
    { name: 'My Team', path: '/MyTeam' }
  ];

  const [taskData, setTaskData] = useState({
    name: '',
    budget: '',
    supplier: '',
    status: '',
    date: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const statusOptions = ['Stopped', 'In Progress', 'Negotiation', 'Completed'];
  const supplierOptions = ['jerry', 'brie', 'laura', 'sam'];

  useEffect(() => {
    // Fetch task details
    const fetchTask = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5003/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch task');
        const data = await res.json();
        setTaskData({
          name: data.name || '',
          budget: data.budget ? String(data.budget) : '',
          supplier: data.supplier || '',
          status: data.status || '',
          date: data.date ? data.date.slice(0, 10) : '',
        });
      } catch (err) {
        setError('Failed to load task details.');
      }
      setLoading(false);
    };
    fetchTask();
  }, [taskId]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setError('');
    if (!taskData.budget || isNaN(Number(taskData.budget))) {
      setError('Please enter a valid number for the budget.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5003/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...taskData, budget: Number(taskData.budget) })
      });
      if (!res.ok) throw new Error('Failed to update task');
      // Navigate back to event management page
      if (eventId) {
        navigate(`/EventsManagementPage/${eventId}`);
      } else {
        navigate(-1);
      }
    } catch (err) {
      setError('Failed to save changes.');
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading task...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#A888B5', padding: '40px 0' }}>
      <div className="edit-task-container" style={{ maxWidth: 540, margin: '0 auto', background: '#441752', padding: 32, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ color: '#fff', marginBottom: 24 }}>Edit Task</h2>
        {error && <div style={{ color: 'white', background: '#D50000', marginBottom: 16, padding: 8, borderRadius: 6 }}>{error}</div>}
        <form onSubmit={handleSaveTask}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>Task Name</label>
            <input name="name" value={taskData.name} onChange={handleChange} required className="edit-input" style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #fff', background: 'transparent', color: '#fff', fontSize: 16 }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>Budget</label>
            <input name="budget" value={taskData.budget} onChange={handleChange} required className="edit-input" type="number" min="0" style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #fff', background: 'transparent', color: '#fff', fontSize: 16 }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>Supplier</label>
            <select name="supplier" value={taskData.supplier} onChange={handleChange} required className="edit-input" style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #fff', background: 'transparent', color: '#fff', fontSize: 16 }}>
              <option value="">Select Supplier</option>
              {supplierOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>Status</label>
            <select name="status" value={taskData.status} onChange={handleChange} required className="edit-input" style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #fff', background: 'transparent', color: '#fff', fontSize: 16 }}>
              <option value="">Select Status</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 18, maxWidth: 180 }}>
            <label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>Date</label>
            <input name="date" value={taskData.date} onChange={handleChange} type="date" required className="edit-input" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #fff', background: 'transparent', color: '#fff', fontSize: 15 }} />
          </div>
          <button type="submit" className="primary-btn" style={{ width: '100%', padding: 14, background: '#A888B5', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 18, marginTop: 8 }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPage;
