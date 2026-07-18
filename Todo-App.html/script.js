const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelector(".filters");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        li.className = `task-item ${task.completed ? "completed" : ""}`;
        li.dataset.id = task.id;

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text">${task.text}</span>

            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        taskList.appendChild(li);
    });
}

// CREATE - Add task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

// Add button
addTaskBtn.addEventListener("click", addTask);

// Add task using Enter key
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Event Delegation for task actions
taskList.addEventListener("click", function(event) {
    const taskItem = event.target.closest(".task-item");

    if (!taskItem) return;

    const id = Number(taskItem.dataset.id);
    const task = tasks.find(task => task.id === id);

    // UPDATE - Complete / Active
    if (event.target.classList.contains("task-checkbox")) {
        task.completed = event.target.checked;

        saveTasks();
        renderTasks();
    }

    // UPDATE - Edit task
    if (event.target.classList.contains("edit-btn")) {
        const updatedText = prompt("Edit your task:", task.text);

        if (updatedText !== null && updatedText.trim() !== "") {
            task.text = updatedText.trim();

            saveTasks();
            renderTasks();
        }
    }

    // DELETE - Delete task
    if (event.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        renderTasks();
    }
});

// Filter using event delegation
filters.addEventListener("click", function(event) {
    if (!event.target.classList.contains("filter-btn")) {
        return;
    }

    currentFilter = event.target.dataset.filter;

    document.querySelectorAll(".filter-btn").forEach(button => {
        button.classList.remove("active");
    });

    event.target.classList.add("active");

    renderTasks();
});

// Initial display
renderTasks();