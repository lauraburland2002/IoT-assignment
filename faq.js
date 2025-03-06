document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.querySelectorAll(".faq-question");
    let answers = document.querySelectorAll(".faq-answer");

    // Find the tallest button and set all buttons to that height
    let maxHeight = 0;
    buttons.forEach(button => {
        if (button.offsetHeight > maxHeight) {
            maxHeight = button.offsetHeight;
        }
    });
    buttons.forEach(button => {
        button.style.height = maxHeight + "px";
    });

    // Toggle answer display on button click
    buttons.forEach((button, index) => {
        button.addEventListener("click", function () {
            answers[index].style.display = answers[index].style.display === "block" ? "none" : "block";
        });
    });
});
