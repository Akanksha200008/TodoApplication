const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const taskData = {
      title: req.body.title,
      description: req.body.description,
      user: req.user.id, // Assuming you have authentication middleware
      completed: req.body.completed || false
    };
    
    // Add priority if provided
    if (req.body.priority) {
      taskData.priority = req.body.priority;
    }
    
    // Add dueDate if provided
    if (req.body.dueDate) {
      taskData.dueDate = new Date(req.body.dueDate);
    }
    
    const task = new Task(taskData);
    const savedTask = await task.save();
    
    console.log('Task saved successfully:');
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const updateData = {};
    
    // Only include fields that are provided
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.completed !== undefined) updateData.completed = req.body.completed;
    if (req.body.priority !== undefined) updateData.priority = req.body.priority;
    
    if (req.body.dueDate !== undefined) {
      if (req.body.dueDate === null || req.body.dueDate === '') {
        updateData.dueDate = null;
      } else {
        updateData.dueDate = new Date(req.body.dueDate);
      }
    }
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    console.log('Task updated successfully');
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: error.message });
  }
};


// And your getTasks controller function
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: error.message });
  }
};


// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    // Find task and check ownership
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if the task belongs to the authenticated user
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
