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

