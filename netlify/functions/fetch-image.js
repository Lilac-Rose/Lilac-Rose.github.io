// netlify/functions/fetch-image.js

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=YOUR_API_KEY_HERE'; // Replace with your API endpoint

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error fetching data'
        };
    }
};
