import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EventsManagementPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  // Guard: if eventId is missing, redirect to dashboard
  useEffect(() => {
    if (!eventId) {
      navigate('/SuppliersPage', { replace: true });
    }
  }, [eventId, navigate]);

  const [activeNav, setActiveNav] = useState('Events');
  const [allEvents, setAllEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Document upload/download state
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  

  // ...existing code...

  // Delete task
  const handleDeleteTask = async (taskIndex) => {
    const taskToDelete = tasks[taskIndex];
    if (!taskToDelete || !taskToDelete.id) {
      alert('Task ID not found.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
const res = await fetch(`/api/tasks/${taskToDelete.id}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  credentials: 'include',
});
      if (res.ok) {
        const updatedTasks = tasks.filter((_, idx) => idx !== taskIndex);
        setTasks(updatedTasks);
        // Update localStorage if used
        const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
        allTasksObj[eventId] = updatedTasks;
        localStorage.setItem('tasks', JSON.stringify(allTasksObj));
      } else {
        alert('Failed to delete task.');
      }
    } catch (err) {
      alert('Error deleting task.');
    }
  };

  // Edit task: navigate to EditTaskPage with taskId and eventId
  const handleEditTask = (taskIndex) => {
    const task = tasks[taskIndex];
    if (!task || !task.id) {
      alert('Task ID not found.');
      return;
    }
    navigate(`/EditTaskPage/${task.id}?eventId=${eventId}`);
  };

  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Suppliers', path: '/SuppliersProfile' }
  ];

  const userNavItems = [
    { name: 'My Work', path: '/MyWork' },
    { name: 'My Team', path: '/MyTeam' }
  ];

  useEffect(() => {
    const eventsFromStorage = JSON.parse(localStorage.getItem('events')) || [];
    setAllEvents(eventsFromStorage);
    const foundEvent = eventsFromStorage.find(ev => ev.id === eventId);
    setCurrentEvent(foundEvent);
    const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
    setTasks(allTasksObj[eventId] || []);
  }, [eventId]);

  // Fetch documents for the event
  useEffect(() => {
    if (!eventId) return;
    const fetchDocs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/events/${eventId}/documents`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const docs = await res.json();
          setDocuments(docs);
        } else {
          setDocuments([]);
        }
      } catch {
        setDocuments([]);
      }
    };
    fetchDocs();
  }, [eventId]);

  // Handle file input change
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError('');
  };

  // Handle upload submit
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);
      const res = await fetch(`/api/events/${eventId}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const newDoc = await res.json();
        setDocuments(prev => [...prev, newDoc]);
        setSelectedFile(null);
      } else {
        const err = await res.json();
        setUploadError(err.message || 'Failed to upload');
      }
    } catch {
      setUploadError('Failed to upload');
    }
    setUploading(false);
  };

  const handleSelectEvent = (newEventId) => {
    navigate(`/EventsManagementPage/${newEventId}`);
  };

  const handleCreateTask = () => {
    navigate(`/CreateTaskPage/${eventId}`);
  };

  const handleStatusChange = (taskIndex, newStatus) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
    allTasksObj[eventId] = updatedTasks;
    localStorage.setItem('tasks', JSON.stringify(allTasksObj));
  };

  const handleTaskCompletion = (taskIndex) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex ? { ...task, status: task.status === 'Completed' ? 'In Progress' : 'Completed' } : task
    );
    setTasks(updatedTasks);
    const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
    allTasksObj[eventId] = updatedTasks;
    localStorage.setItem('tasks', JSON.stringify(allTasksObj));
  };

  const calculateTaskCompletion = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    return ((completedTasks / tasks.length) * 100).toFixed(2);
  };

  const statusOptions = ['Stopped', 'In Progress', 'Completed'];

  return (
    <div className="app-container">
      <nav className="top-nav">
        <div className="nav-section left">
          <img src={`${process.env.PUBLIC_URL}/images/landingpage/logo.png`} alt="CITADA Logo" className="nav-logo" />
          {mainNavItems.map(item => (
            <button
              key={item.name}
              className={`nav-btn ${activeNav === item.name ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.name);
                navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="nav-section right">
          {userNavItems.map(item => (
            <button
              key={item.name}
              className={`nav-btn ${activeNav === item.name ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.name);
                navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
          <div className="user-profile">Q</div>
        </div>
      </nav>

      <main className="content-area">
        <header className="content-header">
          <div className="header-left">
            <h1 className="event-title">{currentEvent ? currentEvent.name : 'Event Management'}</h1>
            <div className="action-btns">
              <button onClick={handleCreateTask} className="primary-btn create-task-btn">Create Task</button>
              <button onClick={() => navigate(`/EditEventPage/${eventId}`)} className="primary-btn outline" style={{ color: '#A888B5' }}>Edit Event</button>
              <select className="primary-btn outline select-event" onChange={(e) => handleSelectEvent(e.target.value)} value={eventId}>
                {allEvents.map((ev, idx) => (
                  <option key={ev.id} value={ev.id}>Event {idx + 1} - {ev.name}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="tasks-table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Date</th>
                <th>Day</th>
                <th>Budget</th>
                <th>Completed</th>
                <th>Task Done (%)</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#888' }}>No tasks yet for this event.</td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr key={index}>
                    <td>{task.name}</td>
                    <td>{task.supplier}</td>
                    <td>
                      <select value={task.status} onChange={(e) => handleStatusChange(index, e.target.value)}>
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>{task.date}</td>
                    <td>{task.day}</td>
                    <td>{task.budget}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={task.status === 'Completed'}
                        onChange={() => handleTaskCompletion(index)}
                      />
                    </td>
                    <td>{calculateTaskCompletion()}%</td>
                    <td>
                      <button className="task-edit-btn" onClick={() => handleEditTask(index)}>Edit</button>
                      <button className="task-delete-btn" onClick={() => handleDeleteTask(index)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Document Upload & Download Section */}
        <section className="documents-section" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, color: '#441752', marginBottom: 10 }}>Event Documents</h2>
          {/* Upload */}
          <form onSubmit={handleUploadDocument} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit" className="primary-btn" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
            {uploadError && <span style={{ color: 'red', marginLeft: 8 }}>{uploadError}</span>}
          </form>
          {/* List */}
          <div>
            {documents.length === 0 ? (
              <div style={{ color: '#888' }}>No documents uploaded yet.</div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {documents.map(doc => (
                  <li key={doc._id || doc.filename} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{doc.originalname || doc.filename}</span>
                    <a
                      href={`/api/events/documents/download/${doc.filename}`}
                      className="primary-btn outline"
                      style={{ padding: '4px 12px', fontSize: 13 }}
                      target="_blank" rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>


      <style>{`
         :root {
          --primary-blue: #A888B5;
          --hover-blue: #A888B5;
          --light-bg: #A888B5;
          --text-dark: #441752;
          --text-light: #441752;
          --border-color: #441752;
          --stopped: #D50000;
          --in-progress: #00C853;
          --negotiation: #FFAB00;
        }

        .app-container {
          min-height: 100vh;
          background-color: var(--light-bg);
          font-family: 'Inter', sans-serif;
        }

        /* Top Navigation Styles */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          height: 64px;
          background: #441752;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-section {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-logo {
          height: 28px;
          margin-right: 16px;
        }

        .nav-btn {
          padding: 8px 16px;
          border: none;
          background: none;
          color: #A888B5;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .nav-btn:hover {
          background: #A888B5;
          color: #441752;
        }

        .nav-btn.active {
          color: #441752;
          background: #A888B5;
        }

        .user-profile {
          width: 32px;
          height: 32px;
          background: #A888B5;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        /* Main Content Area */
        .content-area {
          padding: 32px 40px;
          margin-top: 64px;
        }

        .content-header {
          margin-bottom: 32px;
        }

        .header-left {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .event-title {
          font-size: 24px;
          color: var(--text-dark);
          margin: 0;
        }

        .action-btns {
          display: flex;
          gap: 16px;
        }

        .primary-btn {
          padding: 10px 24px;
          background: #441752;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary-btn.outline {
          background: #441752;
          border: 2px solid var(--primary-blue);
          color: #441752;
          padding: 8px 16px;
          min-width: 140px;
        }

        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(44, 125, 250, 0.2);
        }

        .primary-btn.create-task-btn {
          background: #441752;
          color: #A888B5;
        }

        .primary-btn.outline.select-event {
          background: #441752;
          border: 2px solid var(--border-color);
          color: #A888B5;
        }

        /* Tasks Table */
        .tasks-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .tasks-table {
          width: 100%;
          border-collapse: collapse;
        }

        .tasks-table th,
        .tasks-table td {
          padding: 16px 24px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .tasks-table th {
          background: var(--light-bg);
          color: var(--text-light);
          font-weight: 600;
        }

        .tasks-table select {
          padding: 6px 12px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: white;
        }

        .tasks-table select:hover {
          background: var(--light-bg);
        }

        .primary-btn:hover, .add-btn:hover {
          transform: scale(1.1);
          background: #441752;
        }
      `}</style>
    </div>
  );
};

export default EventsManagementPage;