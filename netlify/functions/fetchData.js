exports.handler = async (event) => {
    const { sheetId } = event.queryStringParameters;
    
    if (!sheetId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing sheetId parameter" })
      };
    }
    
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    
    console.log('Fetching from:', csvUrl); // Add logging
  
    try {
      const data = await new Promise((resolve, reject) => {
        https.get(csvUrl, (res) => {
          // Check status code
          if (res.statusCode !== 200) {
            reject(new Error(`Google Sheets returned status ${res.statusCode}`));
            return;
          }
  
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => resolve(data));
          res.on('error', reject);
        }).on('error', reject);
      });
  
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ data })
      };
    } catch (error) {
      console.error('Function error:', error); // Add logging
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