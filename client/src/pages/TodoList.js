import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import '../styles/TodoList.css';
import { getTasks, createTask, updateTask, deleteTask, formatDateForAPI } from '../services/api';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate task count
  const totalTasks = tasks.length;
  
  // Filter tasks based on current filter
  const filteredTasks = filter === 'all'
    ? tasks
    : filter === 'active'
      ? tasks.filter(task => !task.completed)
      : tasks.filter(task => task.completed);
      
  const handleAddTask = async (taskData) => {
    try {
      // Create a clean task object
      const newTaskData = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority
      };
      
      // Only include dueDate if it's provided and not empty
      if (taskData.dueDate) {
        newTaskData.dueDate = formatDateForAPI(taskData.dueDate);
      }
      
      const newTask = await createTask(newTaskData);
      setTasks([newTask, ...tasks]);
      setShowAddForm(false); // Hide the form after adding
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Failed to add task: ' + (err.message || 'Unknown error'));
      console.error('Error adding task:', err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      // Create a copy of taskData to avoid modifying the original
      const updatedData = { ...taskData };
      
      // Format the due date if it exists
      if (updatedData.dueDate) {
        updatedData.dueDate = formatDateForAPI(updatedData.dueDate);
      }
      
      const updatedTask = await updateTask(editingTask._id, updatedData);
      setTasks(
        tasks.map((task) =>
          task._id === editingTask._id ? updatedTask : task
        )
      );
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
    }
  };

  const handleInlineUpdateTask = async (taskId, taskData) => {
    try {
      // Get the existing task
      const existingTask = tasks.find(task => task._id === taskId);
      if (!existingTask) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      // Create a clean update object with only the fields we want to update
      const updateData = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        completed: existingTask.completed // Preserve completed status
      };
      
      // Only include dueDate if it's provided and valid
      if (taskData.dueDate) {
        updateData.dueDate = formatDateForAPI(taskData.dueDate);
      }
      
      const updatedTask = await updateTask(taskId, updateData);
      
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? updatedTask : task
        )
      );
      setError(''); // Clear any previous errors on success
    } catch (err) {
      console.error("Error updating task:", err);
      setError(`Failed to update task: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter((task) => task._id !== taskId));
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error(err);
      }
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === taskId);
      if (!taskToUpdate) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      // Create update object that preserves all fields
      const updateData = {
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        priority: taskToUpdate.priority,
        completed: completed
      };
      
      // Only include dueDate if it exists
      if (taskToUpdate.dueDate) {
        updateData.dueDate = formatDateForAPI(taskToUpdate.dueDate);
      }
      
      const updatedTask = await updateTask(taskId, updateData);
      
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? updatedTask : task
        )
      );
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
    }
  };
    
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowAddForm(false); // Hide add form when editing
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (editingTask) {
      setEditingTask(null);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading tasks...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Tasks ({totalTasks})</h1>
        {!editingTask && (
          <button 
            className="btn btn-primary"
            onClick={toggleAddForm}
          >
            {showAddForm ? 'Hide Form' : 'Add New Task'}
          </button>
        )}
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {editingTask ? (
        <TaskForm
          onSubmit={handleUpdateTask}
          initialData={editingTask}
          isEditing={true}
          onCancel={handleCancelEdit}
        />
      ) : (
        showAddForm && <TaskForm onSubmit={handleAddTask} />
      )}
      
      <div className="mt-4">        
        {filteredTasks.length === 0 ? (
          <div className="alert alert-info">
            {filter === 'all'
              ? 'No tasks yet. Add a new task to get started!'
              : filter === 'active'
                ? 'No active tasks.'
                : 'No completed tasks.'}
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onUpdateTask={handleInlineUpdateTask}
          />
        )}
      </div>
    </div>
  );
};

export default TodoList;
