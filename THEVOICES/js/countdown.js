const countdownDate = new Date("Dec 17, 2024 17:00:00 GMT"); // 5 PM UTC

// Update the countdown every 1 second
const timerElement = document.getElementById("timer");

const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    // Time calculations for days, hours, minutes, and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in the timer element
    timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // If the countdown is over, redirect to the hub page (Phase 1)
    if (distance < 0) {
        clearInterval(x);
        timerElement.innerHTML = "The Game Has Begun!";

        // Redirect to hub page (Phase 1)
        window.location.href = 'hub.html';  // Change 'hub.html' to the actual path if needed
    }
};

// Update the countdown every 1 second
const x = setInterval(updateCountdown, 1000);