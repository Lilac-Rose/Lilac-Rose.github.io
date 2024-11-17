// Function to generate subtle red noise in the background
function generateNoise() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    // Generate red noise
    for (let i = 0; i < data.length; i += 4) {
        const r = Math.random() * 255; // Random red value
        const g = Math.random() * 10;  // Low green value to keep it red
        const b = Math.random() * 10;  // Low blue value to keep it red
        const a = 10 + Math.random() * 50; // Low alpha for transparency effect

        // Set pixel data
        data[i] = r;        // Red
        data[i + 1] = g;    // Green
        data[i + 2] = b;    // Blue
        data[i + 3] = a;    // Alpha (opacity)
    }

    ctx.putImageData(imageData, 0, 0);

    // Animate the noise effect to simulate movement
    let offset = 0;
    function animateNoise() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, offset);
        offset += 0.5;
        if (offset >= canvas.height) offset = 0;
        requestAnimationFrame(animateNoise);
    }
    animateNoise();
}

function updateCountdown() {
    const targetDate = new Date('December 1, 2024 00:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft <= 0) {
        document.getElementById('countdown-container').innerHTML = "<h1>The Game Has Begun</h1>";
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
generateNoise(); // Call the noise generation function
