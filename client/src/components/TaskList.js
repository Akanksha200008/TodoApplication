import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete, onUpdateTask }) => {
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="task-list">
      <h3>Active Tasks</h3>
      {incompleteTasks.length === 0 ? (
        <div className="alert alert-info">No active tasks.</div>
      ) : (
        incompleteTasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
            onUpdateTask={onUpdateTask}
          />
        ))
      )}

      {completedTasks.length > 0 && (
        <>
          <h3 className="mt-4">Completed Tasks</h3>
          {completedTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
              onUpdateTask={onUpdateTask}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default TaskList;
