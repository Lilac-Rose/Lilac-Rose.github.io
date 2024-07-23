const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const apiKey = process.env.NASA_API_KEY; // Use environment variable for your API key
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
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
