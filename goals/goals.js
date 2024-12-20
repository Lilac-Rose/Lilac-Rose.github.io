const SHEET_ID = "16lWlwHzF9l86O_PM5I-IxQGSnl1OiH6zFj5Vn-QW5Ow"; 
const SHEET_NAME = "goals";

const games = {
  "Celeste": {
    "Any%": "A5:H9",
  }
};

async function fetchAndFormatData(sheetId, sheetName, range) {
  try {
    const fetchResponse = await fetch(
      `/.netlify/functions/fetchData?sheetId=${sheetId}&sheetName=${sheetName}&range=${range}`
    );

    if (!fetchResponse.ok) {
      throw new Error("Error fetching data");
    }

    const { data: csvData } = await fetchResponse.json();

    const formatResponse = await fetch(`/.netlify/functions/formatData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csvData }),
    });

    if (!formatResponse.ok) {
      throw new Error("Error formatting data");
    }

    const { formattedData } = await formatResponse.json();
    return formattedData;
  } catch (error) {
    console.error("Failed to fetch or format data:", error);
    showError(error.message);
  }
}

function showError(message) {
  const container = document.getElementById("categories");
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("error-message");
  errorDiv.textContent = `Error: ${message}`;
  container.appendChild(errorDiv);
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
      <th>Time Taken (Hours)</th>
      <th>Enjoyment (0-10)</th>
    </tr>
  `;
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");
  formattedData.forEach(({ goal, completed, timeTaken, enjoyment }) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${goal}</td>
      <td>${completed ? "✓" : "✗"}</td>
      <td>${timeTaken?.toFixed(1) || '-'}</td>
      <td>${enjoyment || '-'}</td>
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