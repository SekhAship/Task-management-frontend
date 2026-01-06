import React from 'react';

const TaskItem = ({ task, onUpdateStatus, onDelete }) => {
  if (!task) return null;

  return (
    <div className="task-item">
      <div className="task-content">
        <h3>{task.title || 'Untitled Task'}</h3>
        {task.description && <p className="task-desc">{task.description}</p>}
        
        <div className="task-meta">
           <span className={`status-badge ${task.status || 'pending'}`}>
             {(task.status || 'pending').replace('-', ' ')}
            </span>
        </div>
      </div>
      
      <div className="task-actions">
        <select
          className="status-select"
          value={task.status || 'pending'}
          onChange={(e) => {
            const newStatus = e.target.value;
            if (window.confirm('Are you sure you want to change the status?')) {
                onUpdateStatus(task.id, newStatus);
            }
          }}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
        </select>
        
        <button
          className="delete-btn"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

const TaskList = ({ tasks, loading, onUpdateStatus, onDelete }) => {
  if (loading && (!tasks || tasks.length === 0)) {
    return <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Loading tasks...</div>;
  } 

  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
        No tasks found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
           onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
