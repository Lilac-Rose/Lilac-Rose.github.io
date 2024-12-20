const SHEET_ID = "16lWlwHzF9l86O_PM5I-IxQGSnl1OiH6zFj5Vn-QW5Ow"; 
const SHEET_NAME = "Sheet1";

document.documentElement.style.setProperty('--container-width', '1600px');

function formatCompletionStatus(value) {
  return value === "TRUE" ? "✓" : "✗";
}

const games = {
  "Celeste": {
    background: "../images/celeste-background.jpg",
    dataType: "standard",
    columns: [
      { header: "Goal", key: "goal", width: "30%" },
      { header: "Completed", key: "completed", width: "10%", format: formatCompletionStatus },
      { header: "Time (Hours)", key: "timeTaken", width: "10%", format: value => value ? parseFloat(value).toFixed(1) : "-" },
      { header: "Enjoyment", key: "enjoyment", width: "10%" },
      { header: "Notes", key: "notes", width: "25%" },
      { header: "Completion Date", key: "completionDate", width: "15%" }
    ],
    categories: {
      "Any%": "A6:F9",
      "ARB": "A12:F14",
      "TE": "A17:F19",
      "100%": "A22:F25"
    }
  },
  "Celeste: Strawberry Jam": {
    background: "../images/celeste-background.jpg",
    dataType: "berries",
    columns: [
      { header: "Goal", key: "goal", width: "33%" },
      { header: "Red Berries", key: "arb", width: "33%", format: formatCompletionStatus },
      { header: "Golden/Silver", key: "goldsilver", width: "33%", format: formatCompletionStatus }
    ],
    categories: {
      "Beginner": "H6:J27",
      "Intermediate": "L6:N24",
      "Advanced": "L26:N51",
      "Expert": "P6:R35",
      "Grandmaster": "P37:R55"
    }
  }
};

function checkCompletion(item, gameConfig) {
  if (gameConfig.dataType === "standard") {
    return item.completed === "TRUE";
  } else if (gameConfig.dataType === "berries") {
    const redBerryValue = item.arb?.trim();
    const goldenSilverValue = item.goldsilver?.trim();
    return (redBerryValue === "TRUE") || (goldenSilverValue === "TRUE");
  }
  return item.completed === "TRUE";
}

const gameBackgrounds = {
  "Celeste": "../images/celeste-background.jpg"
};

let totalStats = {
  completed: 0,
  total: 0
};

function toggleCollapse(element) {
  element.classList.toggle('collapsed');
  
  if (element.classList.contains('game-section')) {
    const categories = element.querySelectorAll('.category-section');
    categories.forEach(category => {
      if (element.classList.contains('collapsed')) {
        category.classList.add('collapsed');
      } else {
        category.classList.remove('collapsed');
      }
    });
  }
}

async function fetchAndFormatData(sheetId, sheetName, range) {
  try {
    console.log('Starting fetchAndFormatData for range:', range);
    const functionUrl = `/.netlify/functions/fetchData?sheetId=${sheetId}&range=${encodeURIComponent(range)}`;
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
        range: range
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

async function renderDataForCategory(gameName, categoryName, range, parentElement) {
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

  const gameConfig = games[gameName];
  const categoryStats = {
    completed: formattedData.filter(item => checkCompletion(item, gameConfig)).length,
    total: formattedData.length
  };

  const gameStatsDiv = gameSection.querySelector('.game-stats');
  const currentGameStats = JSON.parse(gameStatsDiv.dataset.stats);
  currentGameStats.completed += categoryStats.completed;
  currentGameStats.total += categoryStats.total;
  gameStatsDiv.dataset.stats = JSON.stringify(currentGameStats);
  gameStatsDiv.innerHTML = createProgressBar(currentGameStats.completed, currentGameStats.total);

  totalStats.completed += categoryStats.completed;
  totalStats.total += categoryStats.total;
  updateOverallStats();

  const categorySection = document.createElement("div");
  categorySection.classList.add("category-section");

  const categoryHeader = document.createElement("div");
  categoryHeader.classList.add("category-header", "collapsible-header");
  categoryHeader.addEventListener('click', (e) => {
    if (!e.target.closest('.category-stats')) {
      toggleCollapse(categorySection);
    }
  });

  const categoryTitle = document.createElement("h3");
  categoryTitle.textContent = categoryName;
  categoryHeader.appendChild(categoryTitle);

  const categoryProgress = document.createElement("div");
  categoryProgress.classList.add("category-stats");
  categoryProgress.innerHTML = createProgressBar(categoryStats.completed, categoryStats.total);
  categoryHeader.appendChild(categoryProgress);

  categorySection.appendChild(categoryHeader);

  const categoryContent = document.createElement("div");
  categoryContent.classList.add("collapsible-content");
  categorySection.appendChild(categoryContent);

  const table = document.createElement("table");
  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const columns = gameConfig.columns;
  columns.forEach(column => {
    const th = document.createElement("th");
    th.textContent = column.header;
    th.style.width = column.width;
    headerRow.appendChild(th);
  });

  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");
  formattedData.forEach(rowData => {
    const row = document.createElement("tr");
    columns.forEach(column => {
      const td = document.createElement("td");
      let cellContent = rowData[column.key];
      
      if (column.format && cellContent !== undefined) {
        cellContent = column.format(cellContent);
      }
      
      if (cellContent === undefined || cellContent === '') {
        cellContent = '-';
      }
      
      td.textContent = cellContent;
      row.appendChild(td);
    });
    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  categoryContent.appendChild(table);
  parentElement.appendChild(categorySection);
}

function updateOverallStats() {
  const overallStats = document.getElementById("overall-stats");
  overallStats.innerHTML = createProgressBar(totalStats.completed, totalStats.total);
}

async function renderDataForGame(gameName, gameData) {
  console.log('Rendering game:', gameName);
  const container = document.getElementById("categories");

  const gameSection = document.createElement("div");
  gameSection.classList.add("game-section");
  gameSection.setAttribute("data-game", gameName);

  if (gameBackgrounds[gameName]) {
    const bgDiv = document.createElement("div");
    bgDiv.classList.add("game-section-bg");
    bgDiv.style.backgroundImage = `url(${gameBackgrounds[gameName]})`;
    gameSection.appendChild(bgDiv);
  }

  const gameHeader = document.createElement("div");
  gameHeader.classList.add("game-header", "collapsible-header");
  gameHeader.addEventListener('click', (e) => {
    if (!e.target.closest('.game-stats')) {
      toggleCollapse(gameSection);
    }
  });

  const gameTitle = document.createElement("h2");
  gameTitle.textContent = gameName;
  gameHeader.appendChild(gameTitle);

  const gameStats = document.createElement("div");
  gameStats.classList.add("game-stats");
  gameStats.dataset.stats = JSON.stringify({ completed: 0, total: 0 });
  gameStats.innerHTML = createProgressBar(0, 0);
  gameHeader.appendChild(gameStats);

  gameSection.appendChild(gameHeader);
  
  const gameContent = document.createElement("div");
  gameContent.classList.add("collapsible-content");
  gameSection.appendChild(gameContent);
  
  container.appendChild(gameSection);

  for (const [categoryName, range] of Object.entries(gameData.categories)) {
    await renderDataForCategory(gameName, categoryName, range, gameContent);
  }
}

async function renderAllGames() {
  console.log('Starting renderAllGames');
  const container = document.getElementById("categories");
  container.innerHTML = "";

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

  totalStats = { completed: 0, total: 0 };

  for (const [gameName, gameData] of Object.entries(games)) {
    await renderDataForGame(gameName, gameData);
  }
}

console.log('Script loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting render');
  renderAllGames();
});