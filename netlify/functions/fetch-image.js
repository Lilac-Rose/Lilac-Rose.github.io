const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const apiKey = process.env.NASA_API_KEY;  // Use environment variable for the API key
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

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
