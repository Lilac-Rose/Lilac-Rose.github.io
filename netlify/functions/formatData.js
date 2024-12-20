exports.handler = async (event) => {
  const { csvData } = JSON.parse(event.body);

  if (!csvData) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing CSV data" }),
    };
  }

  try {
    const rows = csvData.split("\n").map((row) => 
      row.split(",").map(cell => cell.trim())
    );

    // Skip the header row
    const dataRows = rows.slice(1);

    const formattedData = dataRows
      .filter(cells => cells.length >= 4 && cells[0] && cells[0].trim())
      .map((cells) => ({
        goal: cells[0]?.trim() || '',
        completed: (cells[1]?.trim().toLowerCase() === 'true' || cells[1]?.trim().toLowerCase() === 'yes'),
        timeTaken: cells[2] ? parseFloat(cells[2]) || 0 : 0,
        enjoyment: cells[3] ? parseInt(cells[3]) || 0 : 0,
        notes: cells[4]?.trim() || '',
        completionDate: cells[5]?.trim() || ''
      }));

    return {
      statusCode: 200,
      body: JSON.stringify({ formattedData }),
    };
  } catch (error) {
    console.error('Format error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};