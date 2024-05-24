
    const list = document.getElementById('todo-list');
    const itemCountSpan = document.getElementById('item-count');
    const uncheckedCountSpan = document.getElementById('unchecked-count');

    let todos = [];

    function loadTodos() {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        todos = JSON.parse(storedTodos);
      }
    }

    function saveTodos() {
      localStorage.setItem('todos', JSON.stringify(todos));
    }

    function render(todos) {
      const todosHTML = todos.map(todo => {
        return `
          <li class="list-group-item">
            <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.checked ? 'checked' : ''} onchange="checkTodoHandler(${todo.id}, this.checked)">
            <label for="${todo.id}" class="${todo.checked ? 'text-success completed' : ''}">${todo.text}</label>
            <button class="btn btn-danger btn-sm float-end" onclick="deleteTodoHandler(${todo.id})">delete</button>
          </li>
        `;
      }).join('');

      list.innerHTML = todosHTML;
    }

    function checkTodoHandler(id, checked) {
      const todo = todos.find(todo => todo.id === id);
      if (todo) {
        todo.checked = checked;
        saveTodos();
        updateCounter();
        render(todos);
      }
    }

    function deleteTodoHandler(id) {
      todos = todos.filter(todo => todo.id !== id);
      saveTodos();
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
          id: todos.length + 1,
          text: todoText,
          checked: false
        };

        todos.push(newTodo);
        saveTodos();
        render(todos);
        updateCounter();
      }
    }

    loadTodos();
    render(todos);
    updateCounter();