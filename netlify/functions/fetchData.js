const https = require('node:https');

exports.handler = async (event) => {
  const { sheetId, range } = event.queryStringParameters;
  
  if (!sheetId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing sheetId parameter" })
    };
  }

  const sheetName = 'Sheet1'; 
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&range=${encodeURIComponent(sheetName + '!' + (range || 'A:F'))}`;
  
  try {
    const data = await new Promise((resolve, reject) => {
      const makeRequest = (url) => {
        https.get(url, (res) => {
          // Handle redirects
          if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
            makeRequest(res.headers.location);
            return;
          }

          if (res.statusCode !== 200) {
            reject(new Error(`Google Sheets returned status ${res.statusCode}`));
            return;
          }

          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => resolve(data));
          res.on('error', reject);
        }).on('error', reject);
      };

      makeRequest(csvUrl);
    });

    const rows = data.split('\n').filter(row => row.trim());
    if (rows.length <= 1) {
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