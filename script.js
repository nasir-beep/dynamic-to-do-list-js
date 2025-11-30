// Wait for the DOM to be fully loaded before executing the script
document.addEventListener(DOMContentLoaded, function() {
    // Select DOM elements
    const addButton = document.getElementById(add-task-btn);
    const taskInput = document.getElementById(task-input);
    const taskList = document.getElementById(task-list);
    const totalTasksElement = document.getElementById(total-tasks);
    const completedTasksElement = document.getElementById(completed-tasks);
    const filterButtons = document.querySelectorAll(.filter-btn);
    
    // Initialize tasks array from localStorage or empty array
    let tasks = JSON.parse(localStorage.getItem(tasks)) || [];
    let currentFilter = all;
    
    // Update task statistics
    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        
        totalTasksElement.textContent = `Total: ${totalTasks}`;
        completedTasksElement.textContent = `Completed: ${completedTasks}`;
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem(tasks, JSON.stringify(tasks));
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
            const emptyState = document.createElement(li);
            emptyState.className = empty-state;
            emptyState.textContent = currentFilter === all 
                ? No tasks yet. Add a task to get started > script.js 
                : `No ${currentFilter} tasks.`;
            taskList.appendChild(emptyState);
            return;
        }
        
        // Create and append task elements
        filteredTasks.forEach((task, index) => {
            const li = document.createElement(li);
            li.className = task.completed ? completed : ;
            
            const taskText = document.createElement(span);
            taskText.className = task-text;
            taskText.textContent = task.text;
            taskText.addEventListener(click, () => toggleTaskCompletion(index));
            
            const taskActions = document.createElement(div);
            taskActions.className = task-actions;
            
            const completeBtn = document.createElement(button);
            completeBtn.className = complete-btn;
            completeBtn.textContent = task.completed ? Undo : Complete;
            completeBtn.addEventListener(click, (e) => {
                e.stopPropagation();
                toggleTaskCompletion(index);
            });
            
            const removeBtn = document.createElement(button);
            removeBtn.className = remove-btn;
            removeBtn.textContent = Remove;
            removeBtn.addEventListener(click, (e) => {
                e.stopPropagation();
                removeTask(index);
            });
            
            taskActions.appendChild(completeBtn);
            taskActions.appendChild(removeBtn);
            
            li.appendChild(taskText);
            li.appendChild(taskActions);
            
            taskList.appendChild(li);
        });
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === ) {
            alert(Please enter a task > script.js);
            return;
        }
        
        // Add task to array
        tasks.push({
            text: taskText,
            completed: false
        });
        
        // Clear input
        taskInput.value = ;
        
        // Save and re-render
        saveTasks();
        updateStats();
        renderTasks();
    }
    
    // Remove a task
    function removeTask(index) {
        // Find the actual index in the original tasks array
        const taskId = tasks.findIndex(task => task.text === tasks[index].text);
        tasks.splice(taskId, 1);
        
        // Save and re-render
        saveTasks();
        updateStats();
        renderTasks();
    }
    
    // Toggle task completion
    function toggleTaskCompletion(index) {
        // Find the actual index in the original tasks array
        const taskId = tasks.findIndex(task => task.text === tasks[index].text);
        tasks[taskId].completed = !tasks[taskId].completed;
        
        // Save and re-render
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
    
    // Event listeners
    addButton.addEventListener(click, addTask);
    
    taskInput.addEventListener(keypress, function(event) {
        if (event.key === Enter) {
            addTask();
        }
    });
    
    // Initial render
    updateStats();
    renderTasks();
});
