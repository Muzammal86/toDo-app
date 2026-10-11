// ==========================================
// STEP 1: DOM Elements Target Karna
// ==========================================
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskCounter = document.getElementById('taskCounter');
const completedCount = document.getElementById('completedCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// ==========================================
// STEP 2: Main Array (LocalStorage Se Read Karna)
// ==========================================
let tasks = JSON.parse(localStorage.getItem('procedural_todo_tasks')) || [];

// Active filter track karne ke liye
let currentFilter = 'all';

// ==========================================
// STEP 3: LocalStorage Save Function
// ==========================================
function saveTasksToStorage() {
    localStorage.setItem('procedural_todo_tasks', JSON.stringify(tasks));
}

// ==========================================
// STEP 4: Naya Task Add Karna (addNewTask)
// ==========================================
function addNewTask() {
    let userText = taskInput.value.trim();
    
    if (userText === '') {
        alert("Please Enter the task");
        return;
    }

    let newTask = {
        id: Date.now(),
        text: userText,
        completed: false
    };

    tasks.push(newTask);

    saveTasksToStorage();
    renderTasks();

    taskInput.value = '';
    taskInput.focus();
}

// ==========================================
// STEP 5: Task Status Complete/Uncomplete (Toggle)
// ==========================================
function toggleTaskComplete(taskId) {
    tasks = tasks.map(function(task) {
        if (task.id === taskId) {
            return { id: task.id, text: task.text, completed: !task.completed };
        }
        return task;
    });

    saveTasksToStorage();
    renderTasks();
}

// ==========================================
// STEP 6: Task Delete Karna
// ==========================================
function deleteTask(taskId) {
    tasks = tasks.filter(function(task) {
        return task.id !== taskId;
    });

    saveTasksToStorage();
    renderTasks();
}

// ==========================================
// STEP 7: Screen Par Tasks Render Karna
// ==========================================
function renderTasks() {
    taskList.innerHTML = '';

    // Filter Logic
    let filteredTasks = tasks.filter(function(task) {
        if (currentFilter === 'active') {
            return !task.completed;
        } else if (currentFilter === 'completed') {
            return task.completed;
        }
        return true;
    });

    if(filteredTasks.length === 0) {
        taskList.innerHTML = `<p class="empty-msg">No tasks yet, add one above!</p>`;
        updateCounters();
        return;

    }

    // List Items Loop
    filteredTasks.forEach(function(task) {
        let li = document.createElement('li');
        li.className = 'todo_item_list';

        li.innerHTML = `
            <label class="task-label">
                <input type="checkbox" ${task.completed ? 'checked' : ''} class="task-checkbox">
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            </label>
            <button class="delete-btn" title="Delete Task">&times;</button>
        `;

        let checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', function() {
            toggleTaskComplete(task.id);
        });

        let deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            deleteTask(task.id);
        });

        taskList.appendChild(li);
    });

    // Render hote hi counters update honge
    updateCounters();
}

// ==========================================
// STEP 8: Task Counters Aur Clear Completed Button
// ==========================================
function updateCounters() {
    let pendingTasks = tasks.filter(function(t) { return !t.completed; }).length;
    let finishedTasks = tasks.filter(function(t) { return t.completed; }).length;

    if (taskCounter) {
        taskCounter.textContent = `${pendingTasks} pending`;
    }
    if (completedCount) {
        completedCount.textContent = `${finishedTasks} completed`;
    }

    // Toggle 'Clear Completed' button visibility
    if (clearCompletedBtn) {
        if (finishedTasks > 0) {
            clearCompletedBtn.classList.remove('hidden');
        } else {
            clearCompletedBtn.classList.add('hidden');
        }
    }
}

function clearCompletedTasks() {
    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    saveTasksToStorage();
    renderTasks();
}

// ==========================================
// FILTER BUTTON LISTENERS & EVENT LISTENERS
// ==========================================
filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentFilter = btn.getAttribute('data-filter') || 'all';
        renderTasks();
    });
});

addTaskBtn.addEventListener('click', addNewTask);

taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addNewTask();
    }
});

if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
}

// App start hote hi automatic render
renderTasks();