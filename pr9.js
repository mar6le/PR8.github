const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const dbUrl = 'https://projectname1-31789-default-rtdb.europe-west1.firebasedatabase.app/todos.json';

const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

let todos = [];

function showLoading() {
  loadingDiv.style.display = 'block';
  errorDiv.style.display = 'none';
}

function hideLoading() {
  loadingDiv.style.display = 'none';
}

function showError() {
  loadingDiv.style.display = 'none';
  errorDiv.style.display = 'block';
}

function fetchTodosFromDb() {
  showLoading();
  fetch(dbUrl)
    .then(response => response.json())
    .then(data => {
      todos = data ? Object.keys(data).map(key => ({
        id: key,
        text: data[key].text,
        checked: data[key].checked
      })) : [];
      render(todos);
      updateCounter();
      hideLoading();
    })
    .catch(error => {
      console.error('Error fetching todos:', error);
      showError();
    });
}

function saveTodoToDb(todo, callback) {
  fetch(dbUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: todo.text,
      checked: todo.checked
    })
  })
  .then(response => response.json())
  .then(data => {
    todo.id = data.name;
    callback(todo);
  })
  .catch(error => console.error('Error saving todo:', error));
}

function updateTodoInDb(id, updates) {
  fetch(`https://projectname1-31789-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  })
  .catch(error => console.error('Error updating todo:', error));
}

function deleteTodoFromDb(id) {
  fetch(`https://projectname1-31789-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`, {
    method: 'DELETE'
  })
  .catch(error => console.error('Error deleting todo:', error));
}

function render(todos) {
  const todosHTML = todos.map(todo => {
    return `
      <li class="list-group-item">
        <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.checked ? 'checked' : ''} onchange="checkTodoHandler('${todo.id}', this.checked)">
        <label for="${todo.id}" class="${todo.checked ? 'text-success text-decoration-line-through' : ''}">${todo.text}</label>
        <button class="btn btn-danger btn-sm float-end" onclick="deleteTodoHandler('${todo.id}')">delete</button>
      </li>
    `;
  }).join('');

  list.innerHTML = todosHTML;
}

function checkTodoHandler(id, checked) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.checked = checked;
    updateTodoInDb(id, { checked });
    updateCounter();
    render(todos);
  }
}

function deleteTodoHandler(id) {
  todos = todos.filter(todo => todo.id !== id);
  deleteTodoFromDb(id);
  updateCounter();
  render(todos);
}

function updateCounter() {
  itemCountSpan.textContent = todos.length;
  const uncheckedCount = todos.filter(todo => !todo.checked).length;
  uncheckedCountSpan.textContent = uncheckedCount;
}

function newTodo() {
  const todoText = prompt('Enter new TODO:');
  
  if (todoText) {
    const newTodo = {
      text: todoText,
      checked: false
    };

    saveTodoToDb(newTodo, (todoWithId) => {
      todos.push(todoWithId);
      render(todos);
      updateCounter();
    });
  }
}

fetchTodosFromDb();
