document.addEventListener('DOMContentLoaded', () => {
    fetchImage();
});

function fetchImage() {
    const apiUrl = 'https://lilacrose.netlify.app/.netlify/functions/fetch-image'; // Use your Netlify function URL

    fetch(apiUrl, {
        method: 'GET',
        headers: {
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
    imageElement.src = data.url; // Adjust based on your API response
    imageElement.style.display = 'block'; // Show the image element
}
