import { useState } from 'react';

const TaskForm = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    


    onCreate({ 
      title, 
      description
    });
    
    setTitle('');
    setDescription('');

  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="task-form">

        <div className="input-group">
           <input
            type="text"
            className="input-field"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
           />
        </div>
        
        <div className="input-group">
          <textarea
            className="input-field"
            placeholder="Description (optional)"
            rows="3"
            value={description}

            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary">
          <span>+</span> Create Task
          
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
