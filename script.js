const apiUrl = 'http://localhost:3000';

// Load tasks
async function loadTasks() {
  const response = await fetch(`${apiUrl}/displayTask`);
  const tasks = await response.json();

  const tasksDiv = document.getElementById('tasks');
  tasksDiv.innerHTML = ''; 

  tasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    
    taskDiv.innerHTML = `
      <div class="task-details">
        <span><strong>Task Name:</strong> ${task.task_name}</span>
        <span><strong>Status:</strong> ${task.task_status}</span>
      </div>
      <div class="task-actions">
        <button class="update-btn" onclick="updateTask(${task.tasks_id})">Update</button>
        <button class="delete-btn" onclick="deleteTask(${task.tasks_id})">Delete</button>
      </div>
    `;

    tasksDiv.appendChild(taskDiv);
  });
}


// Add task
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    
    const taskName = document.getElementById('taskName').value;
    const taskStatus = 'Pending';
  
    if (!taskName) {
      alert('Task name is required!');
      return;  
    }
  
    try {
      const response = await fetch(`${apiUrl}/addTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_name: taskName, task_status: taskStatus }),
      });
  
      if (response.ok) {
        loadTasks();
        e.target.reset();
      } else {
        const errorMessage = await response.text();
        alert('Failed to add task: ' + errorMessage);
      }

    } catch (error) {
      console.error('Error adding task:', error);
      alert('An error occurred while adding the task.');
    }
  });

  // Update task
async function updateTask(tasks_id) {

  const res = await fetch(`${apiUrl}/displayTask/${tasks_id}`);
  const tasks = await res.json();

  const taskName = tasks[0].task_status;

  if (taskName === 'Completed') {
    alert('Task cannot be updated. It is already completed.');
    return;
  }

    const newTaskName = prompt('Enter new task name:');
    const newTaskStatus = prompt('Enter new task status (Pending/Completed):');
  
    if (!newTaskName || !newTaskStatus) {
      alert('Task name and status are required!');
      return;
    }
  
    const response = await fetch(`${apiUrl}/updateTask/${tasks_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task_name: newTaskName, task_status: newTaskStatus }),
    });
  
    if (response.ok) {
      loadTasks();
    } else {
      alert('Failed to update task: ' + (await response.text()));
    }
  }

// Delete task
async function deleteTask(tasks_id) {
  const response = await fetch(`${apiUrl}/deleteTask/${tasks_id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    loadTasks();
  } else {
    alert('Failed to delete task: ' + (await response.text()));
  }
}

// Initial load
loadTasks();

