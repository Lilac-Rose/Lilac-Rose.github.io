const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { sheetId, sheetName, range } = event.queryStringParameters;

  if (!sheetId || !sheetName || !range) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required query parameters" }),
    };
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}&range=${range}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const csvText = await response.text();
    return {
      statusCode: 200,
      body: JSON.stringify({ data: csvText }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
