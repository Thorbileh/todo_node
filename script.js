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
  try {
    
    const res = await fetch(`${apiUrl}/displayTask/${tasks_id}`);
    const taskData = await res.json();


    if (!taskData || taskData.length === 0) {
      console.error(`Task with ID ${tasks_id} not found.`);
      alert('Task not found.');
      return;
    }


    const task = Array.isArray(taskData) ? taskData[0] : taskData;


    if (task.task_status === 'Completed') {
      alert('Task cannot be updated. It is already completed.');
      return;
    }


    const newTaskName = prompt('Enter new task name:', task.task_name);
    const newTaskStatus = prompt('Enter new task status (Pending/Completed):');


    if (newTaskStatus !== 'Pending' || newTaskStatus !== 'Completed') {
      alert('Task status should be "Pending" or "Completed".');
      return;
    }

    
    if (!newTaskName || !newTaskStatus) {
      alert('Task name and status are required!');
      return;
    }

  
    console.log(`Updating task ID: ${tasks_id}`);
    console.log(`New task name: ${newTaskName}, New task status: ${newTaskStatus}`);

    
    const response = await fetch(`${apiUrl}/updateTask/${tasks_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task_name: newTaskName, task_status: newTaskStatus }),
    });

    if (response.ok) {
      console.log(`Task ${tasks_id} updated successfully.`);
      await loadTasks(); 
    } else {
      
      const errorText = await response.text();
      console.error(`Failed to update task. Server response: ${errorText}`);
      alert('Failed to update task: ' + errorText);
    }
  } catch (error) {
    console.error('Error updating task:', error);
    alert('An error occurred while updating the task.');
  }
}


// Delete task
async function deleteTask(tasks_id) {
  try {
    const response = await fetch(`${apiUrl}/deleteTask/${tasks_id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      loadTasks();
    } else {
      alert('Failed to delete task: ' + (await response.text()));
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('An error occurred while deleting the task.');
  }
}

// Initial load
loadTasks();

