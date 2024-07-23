document.addEventListener('DOMContentLoaded', () => {
    fetchImage();
});

function fetchImage() {
    const apiUrl = 'https://api.nasa.gov/planetary/apod'; // Replace with your API endpoint
    const apiKey = '3eIXWBkFHOKCkYf2yhuhXDqfncbtoi3NV2ErYhQI'; // Replace with your API key

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Api-Key ${apiKey}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // For debugging
        displayImage(data);
    })
    .catch(error => console.error('Error fetching image:', error));
}

function displayImage(data) {
    const imageElement = document.getElementById('fetchedImage');
    imageElement.src = data.imageUrl; // Adjust the property name based on your API response
    imageElement.style.display = 'block'; // Show the image element
}
