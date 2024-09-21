const submitBtn = document.querySelector("#sub-btn");
const todoItems = document.querySelector(".todoSection");
const button = document.getElementById("sub-btn");
const searchBox = document.querySelector("#todoSearch");
const clearBtn = document.querySelector(".clear-all");
const iscomplete = document.querySelectorAll(".iscomplete");
console.log(iscomplete);
let updateflag = false;

todoItems.addEventListener("click", (e) => {
  const items = document.querySelectorAll(".item");

  items.forEach((item) => {
    item.classList.remove("active");

    if (e.target.id === item.id) {
      e.target.classList.add("active");

      // put the content of the active item to the item list text box
      document.querySelector("input[name='todo']").value =
        item.firstElementChild.textContent;
      updateflag = true;
      updateButton();
    }
  });
});
// remove items
todoItems.addEventListener("click", (item) => {
  if (item.target.classList.contains("fa-solid")) {
    if (confirm("Are you sure you want to remove the todo list item ?")) {
      item.target.parentElement.parentElement.remove();
      // remove from local storage
      updateLocalStorage(
        {
          id: item.target.parentElement.parentElement.id,
          todo: item.target.parentElement.parentElement.firstElementChild
            .textContent,
        },
        "remove"
      );
    }
  }
});
// clear all the todos at once
clearBtn.addEventListener("click", clearAllTodos);
// search todos
searchBox.addEventListener("keyup", searchTodo);

document.addEventListener("DOMContentLoaded", () => {
  // Your code here
  // to get the todos from local storage
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  // loop through the todos
  if (todos) {
    todos.forEach((todo) => {
      const todoSection = document.querySelector(".todoSection");
      const item = `<div class="item" id="${todo.id}">
          <span class='text'>${todo.todo}</span>
          <span><i class="fa-solid fa-xmark"></i></span>
          
        </div>`;
      todoSection.insertAdjacentHTML("beforeend", item);
    });
  }
});
submitBtn.addEventListener("click", (e) => {
  const inputData = document.querySelector("input[name='todo']").value;
  e.preventDefault();
  e.stopPropagation();
  // Your code here
  // to add the todo

  if (updateflag) {
    updateTodo(inputData);
  } else {
    addTodo(inputData);
  }
});

// to add the todo
function addTodo(data) {
  if (!duplicateEntry(data)) {
    const todoSection = document.querySelector(".todoSection");
    const id = Math.random().toString(16).substring(2);
    const item = document.createElement("div");
    const span = document.createElement("span");
    const spantext = document.createElement("span");
    const textNode = document.createTextNode(data);
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    spantext.classList.add("text");
    spantext.appendChild(textNode);
    const icon = document.createElement("i");
    item.classList.add("item");
    item.setAttribute("id", id);
    icon.classList.add("fa-solid", "fa-xmark");
    // Your code here
    span.appendChild(icon); // append the icon to the span
    item.appendChild(spantext);
    item.appendChild(span); // append the span to the item
    // console.log(item);
    item.appendChild(checkbox);

    todoSection.appendChild(item);

    // clear todo section
    clearInbox();
    // to update and insert to the local stroage
    updateLocalStorage(
      {
        id: id,
        todo: data,
      },
      "update"
    );
  } else {
    alert("Duplicate entry is not allowed Please try again");
    clearInbox();
    return;
  }
}

// to update the todo
function updateTodo(data) {
  // get all the items
  if (!duplicateEntry(data)) {
    const items = document.querySelector(".todoSection").childNodes;
    const activeItem = document.querySelector(".item.active");
    // remove the item from the dom
    activeItem.remove();
    updateLocalStorage(
      {
        id: activeItem.id,
        todo: activeItem.firstElementChild.textContent,
      },
      "remove"
    );
    updateflag = false;
    addTodo(document.querySelector("input[name='todo']").value);
  } else {
    alert("Duplicate entry is not allowed Please try again");
  }
}

// to search a specific todo
function searchTodo() {
  const value = searchBox.value;
  // Your code here
  // get all the items
  const items = document.querySelectorAll(".item");
  // loop through the items
  items.forEach((item) => {
    // check if the item contains the value
    if (
      !item.firstElementChild.textContent
        .toLowerCase()
        .includes(value.toLowerCase())
    ) {
      // if the item contains the value then show it
      item.style.display = "none";
    } else {
      item.style.display = "block";
    }
  });
}

// to update the data to local stroage
function updateLocalStorage(todo, flag) {
  const todos = JSON.parse(localStorage.getItem("todos")) || []; // get the todos if the item is in local stroage then bring it back otherwise assign an empty array
  if (flag === "update") {
    todos.push(todo); // push the new todo to the todos array
    // set the todos array to local storage
    localStorage.setItem("todos", JSON.stringify(todos));
  } else {
    const newTodo = todos.filter((item) => item.id !== todo.id);
    localStorage.setItem("todos", JSON.stringify(newTodo));
  }
}

// change Button color and text
function updateButton() {
  button.textContent = "Update";
  button.style.backgroundColor = "green";
}

function subButton() {
  button.textContent = "Add";
  button.style.backgroundColor = "royalblue";
}

function duplicateEntry(data) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  let flag = false;
  todos.forEach((todo) => {
    if (todo.todo.toLowerCase() === data.toLowerCase()) {
      // console.log("duplicate entry");
      flag = true;
    }
  });
  return flag;
}

function clearInbox() {
  document.querySelector("input[name='todo']").value = "";
}

function clearAllTodos() {
  if (confirm("Want to clear all todos ?")) {
    const items = document.querySelectorAll(".item");
    items.forEach((item) => {
      item.remove();
    });
    localStorage.clear();
  }
}

// mark complete
function markComplete() {}
