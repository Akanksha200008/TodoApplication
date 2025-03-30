import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete, onUpdateTask }) => {
  useEffect(() => {
    console.log('Task received in TaskItem');
  }, [task]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'low',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  });

  useEffect(() => {
    setEditedTask({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'low',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a clean update object
    const updateData = {
      title: editedTask.title,
      description: editedTask.description,
      priority: editedTask.priority || 'low'
    };
    
    if (editedTask.dueDate) {
      updateData.dueDate = editedTask.dueDate;
    }
    
    onUpdateTask(task._id, updateData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'low',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-danger';
      case 'medium':
        return 'bg-warning';
      case 'low':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.log('Invalid date detected');
        return null;
      }
      return `${date.toLocaleDateString()} (${formatDistanceToNow(date, { addSuffix: true })})`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };

  if (isEditing) {
    return (
      <div className="card mb-3">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor={`title-${task._id}`} className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id={`title-${task._id}`}
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor={`description-${task._id}`} className="form-label">Description</label>
              <textarea
                className="form-control"
                id={`description-${task._id}`}
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor={`priority-${task._id}`} className="form-label">Priority</label>
              <select
                className="form-select"
                id={`priority-${task._id}`}
                name="priority"
                value={editedTask.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor={`dueDate-${task._id}`} className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                id={`dueDate-${task._id}`}
                name="dueDate"
                value={editedTask.dueDate}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const priority = task.priority || 'low';
  
  const formattedDate = formatDate(task.dueDate);
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div className={`card mb-3 ${task.completed ? 'border-success' : isOverdue ? 'border-danger' : ''}`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 className={`card-title mb-0 ${task.completed ? 'text-decoration-line-through' : ''}`}>
            {task.title}
          </h5>
        </div>
        <div>
          <span className={`badge ${getPriorityClass(priority)} me-2`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </span>
        </div>
      </div>
      <div className="card-body">
        <p className="card-text">{task.description || 'No description'}</p>
        {formattedDate && (
          <p className={`card-text ${isOverdue ? 'text-danger' : 'text-muted'}`}>
            <small>Due: {formattedDate}</small>
          </p>
        )}
      </div>
      <div className="card-footer d-flex justify-content-end">
        {!task.completed ? (
          <button
            className="btn btn-sm btn-outline-success me-2"
            onClick={() => onToggleComplete(task._id, true)}
          >
            Mark as Completed
          </button>
        ) : (
          <button
            className="btn btn-sm btn-outline-warning me-2"
            onClick={() => onToggleComplete(task._id, false)}
          >
            Mark as Active
          </button>
        )}
        <button
          className="btn btn-sm btn-outline-primary me-2"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
