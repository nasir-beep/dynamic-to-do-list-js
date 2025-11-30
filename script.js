// Wait for the DOM to be fully loaded before executing the script
document.addEventListener(DOMContentLoaded, function() {
    // Select DOM elements
    const addButton = document.getElementById(add-task-btn);
    const taskInput = document.getElementById(task-input);
    const taskList = document.getElementById(task-list);
    const totalTasksElement = document.getElementById(total-tasks);
    const completedTasksElement = document.getElementById(completed-tasks);
    const remainingTasksElement = document.getElementById(remaining-tasks);
    const filterButtons = document.querySelectorAll(.filter-btn);
    
    // Initialize tasks array from localStorage or empty array
    let tasks = JSON.parse(localStorage.getItem(tasks)) || [];
    let currentFilter = all;
    
    // Update task statistics
    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const remainingTasks = totalTasks - completedTasks;
        
        totalTasksElement.textContent = `Total: ${totalTasks}`;
        completedTasksElement.textContent = `Completed: ${completedTasks}`;
        remainingTasksElement.textContent = `Remaining: ${remainingTasks}`;
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem(tasks, JSON.stringify(tasks));
        console.log(Tasks saved to localStorage:, tasks);
    }
    
    // Load tasks from localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem(tasks);
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            console.log(Tasks loaded from localStorage:, tasks);
        }
        updateStats();
        renderTasks();
    }
    
    // Render tasks based on current filter
    function renderTasks() {
        // Clear the task list
        taskList.innerHTML = ;
        
        // Filter tasks based on current filter
        let filteredTasks = tasks;
        if (currentFilter === active) {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === completed) {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        // Show empty state if no tasks
        if (filteredTasks.length === 0) {
            const emptyState = document.createElement(div);
            emptyState.className = empty-state;
            emptyState.textContent = currentFilter === all 
                ? No tasks yet. Add a task to get started > script.js 
                : `No ${currentFilter} tasks.`;
            taskList.appendChild(emptyState);
            return;
        }
        
        // Create and append task elements
        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement(div);
            taskItem.className = `task-item ${task.completed ? completed : }`;
            taskItem.setAttribute(data-task-id, task.id || index);
            
            const taskCheckbox = document.createElement(input);
            taskCheckbox.type = checkbox;
            taskCheckbox.className = task-checkbox;
            taskCheckbox.checked = task.completed;
            taskCheckbox.addEventListener(change, () => toggleTaskCompletion(task.id || index));
            
            const taskText = document.createElement(span);
            taskText.className = task-text;
            taskText.textContent = task.text;
            
            const removeBtn = document.createElement(button);
            removeBtn.className = remove-btn;
            removeBtn.textContent = Remove;
            removeBtn.addEventListener(click, () => removeTask(task.id || index));
            
            taskItem.appendChild(taskCheckbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(removeBtn);
            
            taskList.appendChild(taskItem);
        });
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === ) {
            alert(Please enter a task > script.js);
            return;
        }
        
        // Add task to array with unique ID
        const newTask = {
            id: Date.now(), // Use timestamp as unique ID
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        
        // Clear input
        taskInput.value = ;
        
        // Save to localStorage and re-render
        saveTasks();
        updateStats();
        renderTasks();
    }
    
    // Remove a task
    function removeTask(taskId) {
        // Find the task index by ID
        const taskIndex = tasks.findIndex(task => task.id === taskId || task.id === undefined);
        
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            
            // Save to localStorage and re-render
            saveTasks();
            updateStats();
            renderTasks();
        }
    }
    
    // Toggle task completion
    function toggleTaskCompletion(taskId) {
        // Find the task by ID
        const task = tasks.find(task => task.id === taskId || task.id === undefined);
        
        if (task) {
            task.completed = !task.completed;
            
            // Save to localStorage and re-render
            saveTasks();
            updateStats();
            renderTasks();
        }
    }
    
    // Clear all completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        
        // Save to localStorage and re-render
        saveTasks();
        updateStats();
        renderTasks();
    }
    
    // Set up filter buttons
    filterButtons.forEach(button => {
        button.addEventListener(click, function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove(active));
            this.classList.add(active);
            
            // Update filter and re-render
            currentFilter = this.getAttribute(data-filter);
            renderTasks();
        });
    });
    
    // Add keyboard shortcut for clearing completed tasks (Ctrl+Shift+C)
    document.addEventListener(keydown, function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === C) {
            event.preventDefault();
            clearCompletedTasks();
        }
    });
    
    // Event listeners
    addButton.addEventListener(click, addTask);
    
    taskInput.addEventListener(keypress, function(event) {
        if (event.key === Enter) {
            addTask();
        }
    });
    
    // Initialize the application
    loadTasks();
    
    // Export functions for testing (if needed)
    if (typeof module !== undefined && module.exports) {
        module.exports = {
            addTask,
            removeTask,
            toggleTaskCompletion,
            clearCompletedTasks,
            updateStats,
            saveTasks,
            loadTasks
        };
    }
});
