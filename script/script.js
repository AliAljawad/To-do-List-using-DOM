document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("add-form");
    const buttons = document.querySelectorAll(".add-task-btn");
    const exit = document.querySelector(".close-btn");
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
});
