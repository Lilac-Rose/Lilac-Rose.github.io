const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  console.log('Function `fetch-image` invoked');
  const apiKey = process.env.NASA_API_KEY;
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  try {
    console.log('Fetching from NASA API');
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.log('NASA API response not ok:', response.status, response.statusText);
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('NASA API response received');
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error in fetch-image function:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Error fetching data', details: error.message })
    };
  }
};