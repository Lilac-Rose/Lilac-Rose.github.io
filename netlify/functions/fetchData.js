const https = require('node:https');

exports.handler = async (event) => {
  const { sheetId, range } = event.queryStringParameters;
  
  if (!sheetId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing sheetId parameter" })
    };
  }

  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&range=${encodeURIComponent(range)}`;
  
  console.log('Fetching from URL:', csvUrl);
  
  try {
    const data = await new Promise((resolve, reject) => {
      const makeRequest = (url) => {
        https.get(url, (res) => {
          if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
            console.log('Redirecting to:', res.headers.location);
            makeRequest(res.headers.location);
            return;
          }

          if (res.statusCode !== 200) {
            reject(new Error(`Google Sheets returned status ${res.statusCode}`));
            return;
          }

          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            console.log('Received data length:', data.length);
            resolve(data)
          });
          res.on('error', reject);
        }).on('error', reject);
      };

      makeRequest(csvUrl);
    });

    console.log('Raw CSV data:', data);

    if (!data || data.trim() === '') {
      console.log('No data received for range:', range);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ data: '' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ data })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};