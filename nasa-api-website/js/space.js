document.addEventListener('DOMContentLoaded', () => {
    fetchImage();
});

function fetchImage() {
    const apiUrl = 'https://gorgeous-liger-a945ec.netlify.app/.netlify/functions/fetch-image'; // Netlify function URL

    fetch(apiUrl)
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
    if (data && data.url) {
        imageElement.src = data.url; // Adjust according to the structure of your API response
        imageElement.style.display = 'block'; // Show the image element
    } else {
        console.error('Image data is not in expected format');
    }
}
