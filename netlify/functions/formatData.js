exports.handler = async (event) => {
  const { csvData } = JSON.parse(event.body);

  if (!csvData) {
    return {
      statusCode: 200,
      body: JSON.stringify({ formattedData: [] }),
    };
  }

  try {
    const rows = csvData
      .split("\n")
      .map(row => row.split(",").map(cell => cell.trim()))
      .filter(row => row.some(cell => cell.length > 0));

    if (rows.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ formattedData: [] }),
      };
    }

    const formattedData = rows
      .filter(cells => cells[0] && cells[0].trim())
      .map((cells) => {
        const completedValue = cells[1]?.trim().toUpperCase();
        return {
          goal: cells[0]?.trim() || '',
          completed: completedValue === "TRUE",
          displayCompleted: completedValue === "TRUE" ? "✓" : (completedValue === "FALSE" ? "✗" : ""),
          timeTaken: cells[2] ? parseFloat(cells[2]) : null,
          enjoyment: cells[3] ? parseInt(cells[3]) : null,
          notes: cells[4]?.trim() || '',
          completionDate: cells[5]?.trim() || '',
          arb: cells[1]?.trim() || '',
          goldsilver: cells[2]?.trim() || ''
        };
      });

    console.log('Formatted data:', formattedData);

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