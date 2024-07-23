const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const apiKey = process.env.NASA_API_KEY; // Your API key
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow all origins
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow all origins
                'Content-Type': 'application/json'
            },
            body: 'Error fetching data'
        };
    }
};
