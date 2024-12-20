exports.handler = async (event) => {
    const { csvData } = JSON.parse(event.body);
  
    if (!csvData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing CSV data" }),
      };
    }
  
    try {
      const rows = csvData.split("\n").map((row) => row.split(","));
      const formattedData = rows.map((cells) => ({
        goal: cells[0]?.trim(),
        description: cells[1]?.trim(),
        status: cells[2]?.trim(),
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
  