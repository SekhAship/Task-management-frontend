import { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import FilterTabs from './components/FilterTabs';
import TaskList from './components/TaskList';

function App() {
  const {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    createTask,
    updateStatus,
    deleteTask
  } = useTasks();

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Client-side filtering to ensure instant UI updates when status changes via Socket/Local state
  const displayedTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div className="app-container">
      <header>
        <div>
          <h1>Task Master</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time Task Management</p>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          )}
        </button>
      </header>

      <main>
        <TaskForm onCreate={createTask} />
        
        <div style={{ marginTop: '2rem' }}>
          <FilterTabs currentFilter={filter} onFilterChange={setFilter} />
          
          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <TaskList 
            tasks={displayedTasks} 
            loading={loading}
            onUpdateStatus={updateStatus}
            onDelete={deleteTask}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
