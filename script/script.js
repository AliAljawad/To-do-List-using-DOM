document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("add-form");
    const buttons = document.querySelectorAll(".add-task-btn");
    const exit = document.querySelector(".close-btn");
    const pendingTasksList = document.getElementById('pending-tasks').querySelector('.task-list');
    const pastDueTasksList = document.getElementById('past-due-tasks').querySelector('.task-list');
    const pendingTaskSection = document.getElementById('pending-tasks');
    const completedTasksListSection = document.getElementById('completed-tasks');
    const pastDueTasksSection = document.getElementById('past-due-tasks');
    const tasks= document.getElementById('myTasks');

    buttons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            form.style.display = "block";
        });
    });

    exit.addEventListener('click', function() {
        form.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target === form) {
            form.style.display = "none";
        }
    });

    const descrInput = document.getElementById("descr");
    const dateInput = document.getElementById("date");
    const timeInput = document.getElementById("task-time");
    const assignInput = document.getElementById("assign-to");

    const submitButton = document.getElementById("submit");

    submitButton.addEventListener("click", function (e) {
        e.preventDefault(); 

        const descrValue = descrInput.value;
        const dateValue = dateInput.value;
        const timeValue = timeInput.value;
        const assignValue = assignInput.value;

        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.dataset.dueDate = dateValue;
        taskItem.dataset.dueTime = timeValue;
        taskItem.innerHTML = `
            <span>${descrValue} (Assigned to: ${assignValue})</span>
            <span>${dateValue} ${timeValue}</span>
            <button>✅</button>
            <button class="delete-btn">❌</button>
        `;

        const completeBtn = taskItem.querySelector('button');
        completeBtn.addEventListener('click', function() {
            taskItem.remove();
            document.getElementById('completed-tasks').querySelector('.task-list').appendChild(taskItem);
            completeBtn.remove();
        });
        const deleteBtn = taskItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            taskItem.remove();
        });

        pendingTasksList.appendChild(taskItem);

        form.style.display = "none";
        document.getElementById('task-form').reset();
    });

    function checkPastDueTasks() {
        const now = new Date();
        const pendingTasks = pendingTasksList.querySelectorAll('.task-item');
        pendingTasks.forEach(taskItem => {
            const dueDate = new Date(`${taskItem.dataset.dueDate}T${taskItem.dataset.dueTime}`);
            if (now > dueDate) {
                taskItem.remove();
                pastDueTasksList.appendChild(taskItem);
                const completeBtn = taskItem.querySelector('button');
                if (completeBtn) completeBtn.remove();
            }
        });
    }

    setInterval(checkPastDueTasks, 60000);
    checkPastDueTasks();
    window.showTaskList = function showTaskList(taskType) { 
        pastDueTasksSection.style.display = "none";
        pendingTaskSection.style.display = "none";
        completedTasksListSection.style.display = "none"; 
        if (taskType === 'all') {
            pendingTaskSection.style.display = "block";
            completedTasksListSection.style.display = "block";
            pastDueTasksSection.style.display = "block";
        } else {
        switch (taskType) {
            case 'pending':
                pendingTaskSection.style.display = 'block';
                break;
            case 'completed':
                completedTasksListSection.style.display = 'block';
                break;
            case 'past-due':
                pastDueTasksSection.style.display = 'block';
                break;
            
        }
    }
}
tasks.addEventListener('click', function() {
    showTaskList('all');
});

});
