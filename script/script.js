document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("add-form");
  const buttons = document.querySelectorAll(".add-task-btn");
  const exit = document.querySelector(".close-btn");
  const pendingTasksList = document.getElementById("pending-tasks").querySelector(".task-list");
  const pastDueTasksList = document.getElementById("past-due-tasks").querySelector(".task-list");
  const completedTasksList = document.getElementById("completed-tasks").querySelector(".task-list");
  const pendingTaskSection = document.getElementById("pending-tasks");
  const completedTasksListSection = document.getElementById("completed-tasks");
  const pastDueTasksSection = document.getElementById("past-due-tasks");
  const myTasksHeader = document.querySelector(".navbar p");

  const tasksKey = "tasks";
  let tasks = JSON.parse(localStorage.getItem(tasksKey)) || {
    pending: [],
    completed: [],
    pastDue: [],
  };

  function saveTasks() {
    localStorage.setItem(tasksKey, JSON.stringify(tasks));
  }

  function loadTasks() {
    tasks.pending.forEach((task) => addTaskToDOM(task, "pending"));
    tasks.completed.forEach((task) => addTaskToDOM(task, "completed"));
    tasks.pastDue.forEach((task) => addTaskToDOM(task, "past-due"));
  }

  function addTaskToDOM(task, type) {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.dataset.dueDate = task.dueDate;
    taskItem.dataset.dueTime = task.dueTime;
    taskItem.innerHTML = `
            <span>${task.description} (Assigned to: ${task.assignedTo})</span>
            <span>${task.dueDate} ${task.dueTime}</span>
            <button class="complete-btn">✅</button>
            <button class="delete-btn">❌</button>
        `;

    const completeBtn = taskItem.querySelector(".complete-btn");
    completeBtn.addEventListener("click", function () {
      taskItem.remove();
      tasks.pending = tasks.pending.filter(
        (t) =>
          t.description !== task.description ||
          t.dueDate !== task.dueDate ||
          t.dueTime !== task.dueTime
      );
      task.type = "completed";
      tasks.completed.push(task);
      saveTasks();
      addTaskToDOM(task, "completed");
    });

    const deleteBtn = taskItem.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
      taskItem.remove();
      tasks[type] = tasks[type].filter(
        (t) =>
          t.description !== task.description ||
          t.dueDate !== task.dueDate ||
          t.dueTime !== task.dueTime
      );
      saveTasks();
    });

    switch (type) {
      case "pending":
        pendingTasksList.appendChild(taskItem);
        break;
      case "completed":
        completedTasksList.appendChild(taskItem);
        completeBtn.remove();
        break;
      case "past-due":
        pastDueTasksList.appendChild(taskItem);
        completeBtn.remove();
        break;
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      form.style.display = "block";
    });
  });

  exit.addEventListener("click", function () {
    form.style.display = "none";
  });

  window.addEventListener("click", function (event) {
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

    const task = {
      description: descrInput.value,
      dueDate: dateInput.value,
      dueTime: timeInput.value,
      assignedTo: assignInput.value,
      type: "pending",
    };

    tasks.pending.push(task);
    saveTasks();

    addTaskToDOM(task, "pending");

    form.style.display = "none";
    document.getElementById("task-form").reset();
  });

  function checkPastDueTasks() {
    const now = new Date();
    const pendingTasks = pendingTasksList.querySelectorAll(".task-item");
    pendingTasks.forEach((taskItem) => {
      const dueDate = new Date(
        `${taskItem.dataset.dueDate}T${taskItem.dataset.dueTime}`
      );
      if (now > dueDate) {
        const task = {
          description: taskItem
            .querySelector("span")
            .textContent.split(" (Assigned to: ")[0],
          dueDate: taskItem.dataset.dueDate,
          dueTime: taskItem.dataset.dueTime,
          assignedTo: taskItem
            .querySelector("span")
            .textContent.split("Assigned to: ")[1]
            .split(")")[0],
          type: "past-due",
        };

        tasks.pending = tasks.pending.filter(
          (t) =>
            t.description !== task.description ||
            t.dueDate !== task.dueDate ||
            t.dueTime !== task.dueTime
        );
        tasks.pastDue.push(task);
        saveTasks();

        taskItem.remove();
        addTaskToDOM(task, "past-due");
      }
    });
  }

  setInterval(checkPastDueTasks, 10000);
  checkPastDueTasks();

  window.showTaskList = function (taskType) {
    pendingTaskSection.style.display = "none";
    completedTasksListSection.style.display = "none";
    pastDueTasksSection.style.display = "none";

    if (taskType === "all") {
      pendingTaskSection.style.display = "flex";
      completedTasksListSection.style.display = "flex";
      pastDueTasksSection.style.display = "flex";
    } else {
      switch (taskType) {
        case "pending":
          pendingTaskSection.style.display = "flex";
          break;
        case "completed":
          completedTasksListSection.style.display = "flex";
          break;
        case "past-due":
          pastDueTasksSection.style.display = "flex";
          break;
      }
    }
  };

  myTasksHeader.addEventListener("click", function () {
    showTaskList("all");
  });

  loadTasks();
});
