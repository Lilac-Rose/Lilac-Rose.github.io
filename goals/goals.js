const SHEET_ID = "16lWlwHzF9l86O_PM5I-IxQGSnl1OiH6zFj5Vn-QW5Ow"; 
const SHEET_NAME = "Sheet1";

const games = {
  "Celeste": {
    "Any%": "A6:F9",
    "ARB": "A12:F14",
    "TE": "A17:F19",
    "100%": "A22:F25"
  }
};

// Track totals across all games
let totalStats = {
  completed: 0,
  total: 0
};

async function fetchAndFormatData(sheetId, sheetName, range) {
  try {
    console.log('Starting fetchAndFormatData for range:', range);
    const functionUrl = `/.netlify/functions/fetchData?sheetId=${sheetId}&range=${range}`;
    console.log('Fetching from:', functionUrl);

    const fetchResponse = await fetch(functionUrl);
    const responseText = await fetchResponse.text();
    console.log('Raw response:', responseText);

    if (!fetchResponse.ok) {
      throw new Error(`HTTP error! status: ${fetchResponse.status}`);
    }

    let fetchData;
    try {
      fetchData = JSON.parse(responseText);
      console.log('Parsed data:', fetchData);
    } catch (e) {
      console.error('Failed to parse response:', responseText);
      throw new Error('Invalid response format from server');
    }

    if (!fetchData.data) {
      throw new Error('No data received from spreadsheet');
    }

    const formatResponse = await fetch('/.netlify/functions/formatData', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        csvData: fetchData.data,
        range: range // Pass the range to the format function
      })
    });

    console.log('Format response status:', formatResponse.status);
    const formatResult = await formatResponse.json();
    console.log('Formatted data for range', range, ':', formatResult);

    return formatResult.formattedData;

  } catch (error) {
    console.error('Detailed error:', error);
    showError(`${error.message} (Check console for details)`);
    return null;
  }
}

function createProgressBar(completed, total) {
  const percentage = (completed / total) * 100;
  return `
    <div class="progress-container">
      <div class="progress-bar" style="width: ${percentage}%"></div>
      <div class="progress-text">${completed}/${total} (${percentage.toFixed(1)}%)</div>
    </div>
  `;
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
  console.log('Rendering category:', categoryName, 'for game:', gameName, 'with range:', range);
  const gameSection = document.querySelector(`.game-section[data-game="${gameName}"]`);
  const loadingDiv = showLoading(gameSection);

  const formattedData = await fetchAndFormatData(SHEET_ID, SHEET_NAME, range);
  loadingDiv.remove();

  if (!formattedData) {
    console.error('No formatted data received');
    return;
  }

  console.log('Received data for category', categoryName, ':', formattedData);

  const categoryStats = {
    completed: formattedData.filter(item => item.completed).length,
    total: formattedData.length
  };

  // Update game totals
  const gameStatsDiv = gameSection.querySelector('.game-stats');
  const currentGameStats = JSON.parse(gameStatsDiv.dataset.stats);
  currentGameStats.completed += categoryStats.completed;
  currentGameStats.total += categoryStats.total;
  gameStatsDiv.dataset.stats = JSON.stringify(currentGameStats);
  gameStatsDiv.innerHTML = createProgressBar(currentGameStats.completed, currentGameStats.total);

  // Update overall totals
  totalStats.completed += categoryStats.completed;
  totalStats.total += categoryStats.total;
  updateOverallStats();

  const categorySection = document.createElement("div");
  categorySection.classList.add("category-section");

  const categoryHeader = document.createElement("div");
  categoryHeader.classList.add("category-header");
  
  const categoryTitle = document.createElement("h3");
  categoryTitle.textContent = categoryName;
  categoryHeader.appendChild(categoryTitle);

  const categoryProgress = document.createElement("div");
  categoryProgress.classList.add("category-stats");
  categoryProgress.innerHTML = createProgressBar(categoryStats.completed, categoryStats.total);
  categoryHeader.appendChild(categoryProgress);

  categorySection.appendChild(categoryHeader);

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

function updateOverallStats() {
  const overallStats = document.getElementById("overall-stats");
  overallStats.innerHTML = createProgressBar(totalStats.completed, totalStats.total);
}

async function renderDataForGame(gameName, categories) {
  console.log('Rendering game:', gameName);
  const container = document.getElementById("categories");

  const gameSection = document.createElement("div");
  gameSection.classList.add("game-section");
  gameSection.setAttribute("data-game", gameName);

  const gameHeader = document.createElement("div");
  gameHeader.classList.add("game-header");

  const gameTitle = document.createElement("h2");
  gameTitle.textContent = gameName;
  gameHeader.appendChild(gameTitle);

  const gameStats = document.createElement("div");
  gameStats.classList.add("game-stats");
  gameStats.dataset.stats = JSON.stringify({ completed: 0, total: 0 });
  gameStats.innerHTML = createProgressBar(0, 0);
  gameHeader.appendChild(gameStats);

  gameSection.appendChild(gameHeader);
  container.appendChild(gameSection);

  for (const [categoryName, range] of Object.entries(categories)) {
    await renderDataForCategory(gameName, categoryName, range);
  }
}

async function renderAllGames() {
  console.log('Starting renderAllGames');
  const container = document.getElementById("categories");
  container.innerHTML = "";

  // Create overall stats container
  const overallStatsContainer = document.createElement("div");
  overallStatsContainer.classList.add("overall-stats-container");
  
  const overallTitle = document.createElement("h2");
  overallTitle.textContent = "Overall Progress";
  overallStatsContainer.appendChild(overallTitle);

  const overallStats = document.createElement("div");
  overallStats.id = "overall-stats";
  overallStats.innerHTML = createProgressBar(0, 0);
  overallStatsContainer.appendChild(overallStats);

  container.appendChild(overallStatsContainer);

  // Reset totals
  totalStats = { completed: 0, total: 0 };

  for (const [gameName, categories] of Object.entries(games)) {
    await renderDataForGame(gameName, categories);
  }
}

console.log('Script loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting render');
  renderAllGames();
});

const gameBackgrounds = {
  "Celeste": "../images/celeste-background.jpg"
};

async function renderDataForGame(gameName, categories) {
  console.log('Rendering game:', gameName);
  const container = document.getElementById("categories");

  const gameSection = document.createElement("div");
  gameSection.classList.add("game-section");
  gameSection.setAttribute("data-game", gameName);

  // Add the background image container
  if (gameBackgrounds[gameName]) {
    const bgDiv = document.createElement("div");
    bgDiv.classList.add("game-section-bg");
    bgDiv.style.backgroundImage = `url(${gameBackgrounds[gameName]})`;
    gameSection.appendChild(bgDiv);
  }

  const gameHeader = document.createElement("div");
  gameHeader.classList.add("game-header");

  const gameTitle = document.createElement("h2");
  gameTitle.textContent = gameName;
  gameHeader.appendChild(gameTitle);

  const gameStats = document.createElement("div");
  gameStats.classList.add("game-stats");
  gameStats.dataset.stats = JSON.stringify({ completed: 0, total: 0 });
  gameStats.innerHTML = createProgressBar(0, 0);
  gameHeader.appendChild(gameStats);

  gameSection.appendChild(gameHeader);
  container.appendChild(gameSection);

  for (const [categoryName, range] of Object.entries(categories)) {
    await renderDataForCategory(gameName, categoryName, range);
  }
}