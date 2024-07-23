document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    fetchImage();
  });
  
  function fetchImage() {
    console.log('Fetching image...');
    const apiUrl = '/.netlify/functions/fetch-image';
    fetch(apiUrl)
      .then(response => {
        console.log('Response received:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data received:', data);
        displayImage(data);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
        document.body.innerHTML += `<p>Error: ${error.message}</p>`;
      });
  }
  
  function displayImage(data) {
    console.log('Displaying image...');
    const imageElement = document.getElementById('fetchedImage');
    imageElement.src = data.url;
    imageElement.alt = data.title || 'NASA APOD';
    imageElement.style.display = 'block';
    console.log('Image displayed');
  }