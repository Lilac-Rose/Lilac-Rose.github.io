const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event, context) => {
  console.log('Function `fetch-image` invoked');
  console.log('Event:', JSON.stringify(event));
  console.log('Context:', JSON.stringify(context));
  
  const apiKey = process.env.NASA_API_KEY;
  console.log('API Key set:', !!apiKey); // Log whether the API key is set, not the key itself
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  try {
    console.log('Fetching from NASA API');
    const response = await fetch(apiUrl);
    console.log('NASA API response status:', response.status);
    if (!response.ok) {
      console.log('NASA API response not ok:', response.status, response.statusText);
      throw new Error(`Network response was not ok: ${response.status}`);
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