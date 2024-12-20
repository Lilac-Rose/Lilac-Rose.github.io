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

    const dataRows = rows[0][0].toLowerCase().includes('goal') ? rows.slice(1) : rows;

    const formattedData = dataRows
      .filter(cells => cells.length >= 4 && cells[0])
      .map((cells) => ({
        goal: cells[0],
        completed: cells[1]?.toLowerCase() === 'true',
        timeTaken: parseFloat(cells[2]) || 0,
        enjoyment: parseInt(cells[3]) || 0
      }));

    return {
      statusCode: 200,
      body: JSON.stringify({ formattedData }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
