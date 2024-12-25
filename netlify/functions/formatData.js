exports.handler = async (event) => {
  const { csvData, range } = JSON.parse(event.body);

  if (!csvData) {
    return {
      statusCode: 200,
      body: JSON.stringify({ formattedData: [] }),
    };
  }

  try {
    // Split into rows and clean up empty cells
    const rows = csvData
      .split("\n")
      .map(row => row.split(",").map(cell => cell.trim()))
      .filter(row => row.some(cell => cell.length > 0));

    console.log('Raw rows:', rows);

    if (rows.length < 2) { // Need at least header row and one data row
      return {
        statusCode: 200,
        body: JSON.stringify({ formattedData: [] }),
      };
    }

    // Extract headers from first row
    const headers = rows[0].map(header => ({
      key: header.toLowerCase().replace(/\s+/g, '_'),
      label: header
    }));

    // Process data rows
    const formattedData = rows.slice(1) // Skip header row
      .filter(cells => cells[0] && cells[0].trim())
      .map((cells) => {
        const rowData = {};
        cells.forEach((cell, index) => {
          if (index < headers.length) {
            const key = headers[index].key;
            // Check if cell contains TRUE/FALSE value
            if (cell.toUpperCase() === "TRUE" || cell.toUpperCase() === "FALSE") {
              rowData[key] = cell.toUpperCase() === "TRUE";
              rowData[`display_${key}`] = cell.toUpperCase() === "TRUE" ? "✓" : "✗";
            } else {
              // For empty cells or whitespace, store as null
              rowData[key] = cell.trim() || null;
            }
          }
        });
        return rowData;
      });

    console.log('Formatted data:', formattedData);
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        headers: headers,
        formattedData: formattedData 
      }),
    };
  } catch (error) {
    console.error('Format error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};