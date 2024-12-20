const SHEET_ID = "16lWlwHzF9l86O_PM5I-IxQGSnl1OiH6zFj5Vn-QW5Ow"; 
const SHEET_NAME = "Sheet1";

const games = {
  "Celeste": {
    "Any%": "A1:F20", // Updated to include all columns through F
  }
};

async function fetchAndFormatData(sheetId, sheetName, range) {
  try {
    const functionUrl = `/.netlify/functions/fetchData?sheetId=${sheetId}&sheetName=${sheetName}&range=${range}`;
    console.log('Fetching from:', functionUrl);

    const fetchResponse = await fetch(functionUrl);
    const responseText = await fetchResponse.text();
    console.log('Raw response:', responseText);

    let fetchData;
    try {
      fetchData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', responseText);
      throw new Error('Invalid response format from server');
    }

    if (!fetchResponse.ok) {
      throw new Error(fetchData.error || 'Failed to fetch data');
    }

    if (!fetchData.data) {
      throw new Error('No data received from spreadsheet');
    }

    const formatResponse = await fetch(`/.netlify/functions/formatData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csvData: fetchData.data }),
    });

    if (!formatResponse.ok) {
      const formatError = await formatResponse.text();
      console.error('Format error:', formatError);
      throw new Error('Failed to format data');
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

function showError(message) {
  const container = document.getElementById("categories");
  const existingError = container.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("error-message");
  errorDiv.textContent = `Error: ${message}`;
  container.insertBefore(errorDiv, container.firstChild);
}

function showLoading(gameSection) {
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("loading");
  loadingDiv.textContent = "Loading...";
  gameSection.appendChild(loadingDiv);
  return loadingDiv;
}

async function renderDataForCategory(gameName, categoryName, range) {
  const gameSection = document.querySelector(`.game-section[data-game="${gameName}"]`);
  const loadingDiv = showLoading(gameSection);

  const formattedData = await fetchAndFormatData(SHEET_ID, SHEET_NAME, range);
  loadingDiv.remove();

  if (!formattedData) return;

  const categorySection = document.createElement("div");
  categorySection.classList.add("category-section");

  const categoryTitle = document.createElement("h3");
  categoryTitle.textContent = categoryName;
  categorySection.appendChild(categoryTitle);

  const table = document.createElement("table");
  const tableHeader = document.createElement("thead");
  tableHeader.innerHTML = `
    <tr>
      <th>Goal</th>
      <th>Completed</th>
      <th>Time (Hours)</th>
      <th>Enjoyment</th>
      <th>Notes</th>
      <th>Completion Date</th>
    </tr>
  `;
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");
  formattedData.forEach(({ goal, completed, timeTaken, enjoyment, notes, completionDate }) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${goal}</td>
      <td>${completed ? "✓" : "✗"}</td>
      <td>${timeTaken?.toFixed(1) || '-'}</td>
      <td>${enjoyment || '-'}</td>
      <td>${notes || '-'}</td>
      <td>${completionDate || '-'}</td>
    `;
    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  categorySection.appendChild(table);
  gameSection.appendChild(categorySection);
}

async function renderDataForGame(gameName, categories) {
  const container = document.getElementById("categories");

  const gameSection = document.createElement("div");
  gameSection.classList.add("game-section");
  gameSection.setAttribute("data-game", gameName);

  const gameTitle = document.createElement("h2");
  gameTitle.textContent = gameName;
  gameSection.appendChild(gameTitle);

  container.appendChild(gameSection);

  for (const [categoryName, range] of Object.entries(categories)) {
    await renderDataForCategory(gameName, categoryName, range);
  }
}

async function renderAllGames() {
  const container = document.getElementById("categories");
  container.innerHTML = "";

  for (const [gameName, categories] of Object.entries(games)) {
    await renderDataForGame(gameName, categories);
  }
}

renderAllGames();