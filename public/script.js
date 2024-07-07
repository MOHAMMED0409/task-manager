document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('taskList');
  const taskFormContainer = document.getElementById('taskFormContainer');
  const taskForm = document.getElementById('taskForm');
  const taskDetailContainer = document.getElementById('taskDetailContainer');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  const API_URL = 'http://localhost:5500/api/tasks';

  addTaskBtn.addEventListener('click', () => {
    taskFormContainer.style.display = 'block';
    taskDetailContainer.style.display = 'none';
    taskForm.reset();
  });

  cancelBtn.addEventListener('click', () => {
    taskFormContainer.style.display = 'none';
  });

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskId = document.getElementById('taskId').value;
    const task = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      dueDate: document.getElementById('dueDate').value,
    };

    if (taskId) {
      updateTask(taskId, task);
    } else {
      createTask(task);
    }
  });

  function fetchTasks() {
    fetch(API_URL)
      .then(response => response.json())
      .then(tasks => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
          const li = document.createElement('li');
          li.classList.add('task');
          li.dataset.taskId = task._id;
          li.innerHTML = `
            <h2>${task.title}</h2>
            <p>${task.description}</p>
            <p>Due Date: ${new Date(task.dueDate).toLocaleDateString()}</p>
            <button class="edit-btn" data-task-id="${task._id}">Edit</button>
            <button class="delete-btn" data-task-id="${task._id}">Delete</button>
          `;
          li.querySelector('.edit-btn').addEventListener('click', () => editTask(task._id));
          li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task._id));
          taskList.appendChild(li);
        });
      });
  }

  function createTask(task) {
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    .then(() => {
      taskFormContainer.style.display = 'none';
      fetchTasks();
    });
  }

  function updateTask(id, task) {
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    .then(() => {
      taskFormContainer.style.display = 'none';
      fetchTasks();
    });
  }

  function deleteTask(id) {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Task deleted:', data);
      const taskElement = document.querySelector(`[data-task-id='${id}']`);
      if (taskElement) {
        taskElement.remove();
      }
      taskDetailContainer.style.display = 'none';
    })
    .catch(error => {
      console.error('Error deleting task:', error);
    });
  }

  function showTaskDetail(task) {
    taskDetailContainer.style.display = 'block';
    taskFormContainer.style.display = 'none';
    taskDetailContainer.innerHTML = `
      <h2>${task.title}</h2>
      <p>${task.description}</p>
      <p>Due Date: ${new Date(task.dueDate).toLocaleDateString()}</p>
      <button class="edit-btn" data-task-id="${task._id}">Edit</button>
      <button class="delete-btn" data-task-id="${task._id}">Delete</button>
    `;

    document.querySelector('.edit-btn').addEventListener('click', () => editTask(task._id));
    document.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task._id));
  }

  window.editTask = function(id) {
    fetch(`${API_URL}/${id}`)
      .then(response => response.json())
      .then(task => {
        document.getElementById('taskId').value = task._id;
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description;
        document.getElementById('dueDate').value = task.dueDate.split('T')[0];
        taskFormContainer.style.display = 'block';
        taskDetailContainer.style.display = 'none';
      });
  };

  fetchTasks();
});
