import React, { useState, useEffect } from 'react';
import { Header, FilterBar, FAB } from '../components/layout';
import { 
  TaskCard, 
  TaskForm, 
  DeleteConfirmation, 
  EmptyState 
} from '../components/tasks';
import { Loading, Alert } from '../components/common';
import { createTask, SAMPLE_SUGGESTIONS, SAMPLE_TASKS } from '../utils';
import './TaskScreen.css';

const TaskScreen = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [alert, setAlert] = useState(null);

  // Load initial tasks
  useEffect(() => {
    const loadTasks = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setTasks(SAMPLE_TASKS);
      setIsLoading(false);
    };
    loadTasks();
  }, []);

  const handleAddTask = (taskData) => {
    const newTask = createTask(taskData.description, taskData.startTime, taskData.endTime);
    setTasks([newTask, ...tasks]);
    setAlert({ message: 'Task added successfully!', type: 'success' });
  };

  const handleEditTask = (taskData) => {
    setTasks(tasks.map((t) =>
      t.id === editTask.id
        ? { ...t, ...taskData }
        : t
    ));
    setEditTask(null);
    setAlert({ message: 'Task updated successfully!', type: 'success' });
  };

  const handleDeleteConfirm = () => {
    setTasks(tasks.filter((t) => t.id !== deleteTask.id));
    setDeleteTask(null);
    setAlert({ message: 'Task deleted successfully!', type: 'success' });
  };

  const filteredTasks = filterDate
    ? tasks.filter((t) => 
        t.startTime.startsWith(filterDate) || t.endTime.startsWith(filterDate)
      )
    : tasks;

  return (
    <div className="app-container">
      <Header
        user={user}
        taskCount={tasks.length}
        filteredCount={filteredTasks.length}
        showFilter={showFilter}
        onToggleFilter={() => setShowFilter(!showFilter)}
        onLogout={onLogout}
      />

      {showFilter && (
        <FilterBar
          filterDate={filterDate}
          onFilterChange={setFilterDate}
          onClear={() => setFilterDate('')}
        />
      )}

      <div className="content">
        {isLoading ? (
          <Loading />
        ) : filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="task-list">
            {filteredTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={setEditTask}
                onDelete={setDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      <FAB onClick={() => setShowAddForm(true)} />

      <TaskForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleAddTask}
        editTask={null}
        suggestions={SAMPLE_SUGGESTIONS}
      />

      <TaskForm
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        onSave={handleEditTask}
        editTask={editTask}
        suggestions={SAMPLE_SUGGESTIONS}
      />

      <DeleteConfirmation
        isOpen={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={handleDeleteConfirm}
        taskDescription={deleteTask?.description}
      />

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default TaskScreen;
