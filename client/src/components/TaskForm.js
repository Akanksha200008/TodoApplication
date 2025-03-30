import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, initialData = {}, isEditing = false, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low', 
    dueDate: ''
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      let formattedDate = '';
      if (initialData.dueDate) {
        const date = new Date(initialData.dueDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      }
      
      setFormData({
        ...initialData,
        dueDate: formattedDate
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a clean submission object
    const submissionData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority
    };
    
    // Only include dueDate if it's not empty
    if (formData.dueDate) {
      submissionData.dueDate = formData.dueDate;
    }
    
    onSubmit(submissionData);
    
    if (!isEditing) {
      // Reset form after submission if not editing
      setFormData({
        title: '',
        description: '',
        priority: 'low',
        dueDate: ''
      });
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="card-title mb-3">
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              className="form-select"
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="dueDate" className="form-label">
              Due Date
            </label>
            <input
              type="date"
              className="form-control"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
          <div className="d-flex justify-content-end">
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
