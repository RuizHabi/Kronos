// admin login //
const ADMIN_PASSWORD = "1234";
let isLoggedIn = false;

const loginButton = document.getElementById("login-btn");
const passwordInput = document.getElementById("admin-password");
const loginStatus = document.getElementById("login-status");

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    loginButton.click();
  }
});
loginButton.addEventListener("click", () => {
  if (passwordInput.value === ADMIN_PASSWORD) {
    isLoggedIn = true;

    sessionStorage.setItem("adminLoggedIn", "true");

    loginStatus.textContent = "Logged In";
    passwordInput.classList.add("logged-in");
    loginButton.classList.add("logged-in");

    updatePermissions();
  } else {
    alert("Incorrect password");
  }
});

if (sessionStorage.getItem("adminLoggedIn") === "true") {
  isLoggedIn = true;
  loginStatus.textContent = "Logged In";
}

function updatePermissions() {
  
  document.getElementById("todo-input").disabled = !isLoggedIn;
  document.getElementById("add-button").disabled = !isLoggedIn;

  document.querySelectorAll(".delete-button").forEach(button => {
    button.style.display = isLoggedIn ? "block" : "none";
  });
  document.querySelectorAll('#todo-list input[type="checkbox"]').forEach(checkbox => {
    checkbox.disabled = !isLoggedIn;
  });
}




//todo list 
const todoSection = document.querySelector(".tasks");
const warning = document.getElementById("todo-warning");
console.log(todoSection);
console.log(warning);

todoSection.addEventListener("click", () => {
    if (!isLoggedIn) {

        warning.textContent =
            "🔒 Please log in before editing tasks.";

        setTimeout(() => {
            warning.textContent = "";
        }, 3000);
    }
});

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');


updatePermissions();

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener('submit', function(e){
  e.preventDefault();
  addTodo();
});

function addTodo(){
  const todoText = todoInput.value.trim();
  if(todoText.length > 0){
    const todoObject = {
      text: todoText,
      completed: false
    }
    allTodos.push(todoObject);
    updateTodoList();
    saveTodos();
    todoInput.value = "";
  }
}
function updateTodoList(){
  todoListUL.innerHTML = "";
  allTodos.forEach((todo, todoIndex)=>{
    const todoItem = createTodoItem(todo, todoIndex);
    todoListUL.append(todoItem);
  })
}
function createTodoItem(todo, todoIndex){
  const todoId = "todo-"+todoIndex; //it will create a new id for each li //
  const todoLI = document.createElement("li");
  const todoText = todo.text;
  todoLI.className ="todo";
  todoLI.innerHTML = `
      <input type="checkbox" id="${todoId}">
      <label class="custom-checkbox" for="${todoId}">
        <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"></path>
        </svg>
      </label>
      <label for="${todoId}" class="todo-text">
        ${todoText}
      </label>
      
      <button class="delete-button">
        <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z">
          </path>
        </svg>
      </button>
  `;
  const deleteButton = todoLI.querySelector(".delete-button");
  deleteButton.style.display = isLoggedIn ? "block" : "none";
  deleteButton.addEventListener("click", ()=>{
    deleteTodoItem(todoIndex);
  })
  const checkbox = todoLI.querySelector("input");
  checkbox.disabled = !isLoggedIn;
  checkbox.addEventListener("change", ()=>{
    allTodos[todoIndex].completed = checkbox.checked;
    saveTodos();
  })
  checkbox.checked = todo.completed;
  return todoLI;
}

function deleteTodoItem(todoIndex){
  allTodos = allTodos.filter((_, i)=> i !== todoIndex);
  saveTodos();
  updateTodoList(); 
}
function saveTodos(){
  const todosJson = JSON.stringify(allTodos);
  localStorage.setItem("todos", todosJson);
}

function getTodos(){
  const todos = localStorage.getItem("todos") || "[]";
  return JSON.parse(todos);
}

