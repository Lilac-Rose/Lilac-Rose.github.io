// goals.js
const SHEET_ID = "16lWlwHzF9l86O_PM5I-IxQGSnl1OiH6zFj5Vn-QW5Ow";
const SHEET_NAME = "Sheet1";

async function fetchAndFormatData(sheetId, sheetName, range) {
  try {
    // Add error handling for missing parameters
    if (!sheetId || !sheetName || !range) {
      throw new Error('Missing required parameters');
    }

    // Properly encode URI components
    const functionUrl = `/.netlify/functions/fetchData?` + 
      `sheetId=${encodeURIComponent(sheetId)}` +
      `&sheetName=${encodeURIComponent(sheetName)}` +
      `&range=${encodeURIComponent(range)}`;
    
    console.log('Fetching from:', functionUrl);

    const fetchResponse = await fetch(functionUrl, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    // Check content type
    const contentType = fetchResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Unexpected content type:', contentType);
      throw new Error(`Server returned invalid content type: ${contentType}`);
    }

    const responseData = await fetchResponse.json();
    console.log('Response data:', responseData);

    if (!fetchResponse.ok) {
      throw new Error(responseData.error || `Server returned ${fetchResponse.status}`);
    }

    if (!responseData.data) {
      throw new Error('No data received from spreadsheet');
    }

    const formatResponse = await fetch('/.netlify/functions/formatData', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ csvData: responseData.data })
    });

    if (!formatResponse.ok) {
      const formatError = await formatResponse.text();
      console.error('Format error:', formatError);
      throw new Error(`Format error: ${formatError}`);
    }

    const formatResult = await formatResponse.json();
    console.log('Formatted data:', formatResult);
    return formatResult.formattedData;

  } catch (error) {
    console.error('Detailed error:', error);
    showError(`${error.message} (Check console for details)`);
    return null;
  }
}