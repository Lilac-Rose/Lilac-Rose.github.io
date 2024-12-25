const SHEET_ID = "16lWlwHzF9l86O_PM5I-IxQGSnl1OiH6zFj5Vn-QW5Ow"; 
const SHEET_NAME = "Sheet1";

document.documentElement.style.setProperty('--container-width', '1600px');

const games = {
  "Celeste": {
    background: "../images/celeste-background.jpg",
    categories: {
      "Any%": "A5:F9",
      "ARB": "A12:F15",
      "TE": "A18:F21",
      "100%": "A24:F28"
    }
  },
  "Celeste: Strawberry Jam": {
    background: "../images/celeste-background.jpg",
    categories: {
      "Beginner": "H6:J28",
      "Intermediate": "L6:N25",
      "Advanced": "L26:N52",
      "Expert": "P6:R36",
      "Grandmaster": "P37:R56"
    }
  }
};

function checkCompletion(item) {
  // Check for 'completed' field first, then fallback to 'arb' or 'goldsilver'
  if (item.completed !== undefined) {
    return item.completed === true;
  }
  return (item.arb === true || item.goldsilver === true);
}

const gameBackgrounds = {
  "Celeste": "../images/celeste-background.jpg"
};

let totalStats = {
  completed: 0,
  total: 0
};

function initializeSidebar() {
  const mainContent = document.createElement('div');
  mainContent.classList.add('main-content');
  
  const content = document.getElementById('categories');
  const parent = content.parentNode;
  parent.insertBefore(mainContent, content);
  mainContent.appendChild(content);

  const sidebar = document.createElement('div');
  sidebar.classList.add('sidebar');
  
  const toggle = document.createElement('button');
  toggle.classList.add('sidebar-toggle');
  toggle.innerHTML = '☰';
  toggle.onclick = toggleSidebar;

  parent.insertBefore(sidebar, mainContent);
  parent.insertBefore(toggle, mainContent);
  Object.entries(games).forEach(([gameName, gameData]) => {
    const gameNav = document.createElement('div');
    gameNav.classList.add('nav-item');
    gameNav.textContent = gameName;
    gameNav.onclick = () => {
      const gameSection = document.querySelector(`.game-section[data-game="${gameName}"]`);
      if (gameSection) {
        gameSection.scrollIntoView({ behavior: 'smooth' });
      }
      
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      gameNav.classList.add('active');
      
      const subNav = gameNav.nextElementSibling;
      document.querySelectorAll('.sub-nav').forEach(nav => {
        if (nav !== subNav) nav.classList.remove('show');
      });
      subNav.classList.toggle('show');
    };
    sidebar.appendChild(gameNav);
    
    const subNav = document.createElement('div');
    subNav.classList.add('sub-nav');
    Object.keys(gameData.categories).forEach(categoryName => {
      const categoryNav = document.createElement('div');
      categoryNav.classList.add('nav-item');
      categoryNav.textContent = categoryName;
      categoryNav.onclick = (e) => {
        e.stopPropagation();
        const gameSection = document.querySelector(`.game-section[data-game="${gameName}"]`);
        const categorySection = gameSection.querySelector(`.category-section h3[data-category="${categoryName}"]`)
          ?.closest('.category-section');
          
        if (categorySection) {
          categorySection.scrollIntoView({ behavior: 'smooth' });
        }
      };
      subNav.appendChild(categoryNav);
    });
    sidebar.appendChild(subNav);
  });
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.sidebar-toggle');
  const mainContent = document.querySelector('.main-content');
  
  sidebar.classList.toggle('collapsed');
  toggle.classList.toggle('collapsed');
}

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

    return formatResult;

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

  const response = await fetchAndFormatData(SHEET_ID, SHEET_NAME, range);
  loadingDiv.remove();

  if (!response || !response.formattedData) {
    console.error('No formatted data received');
    return;
  }

  const { headers, formattedData } = response;
  console.log('Received data for category', categoryName, ':', formattedData);

  const categoryStats = {
    completed: formattedData.filter(item => checkCompletion(item)).length,
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
  categoryTitle.setAttribute('data-category', categoryName);
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

  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header.label;
    th.style.width = `${100 / headers.length}%`;
    headerRow.appendChild(th);
  });

  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");
  formattedData.forEach(rowData => {
    const row = document.createElement("tr");
    headers.forEach(header => {
      const td = document.createElement("td");
      const value = rowData[header.key];
      const displayValue = rowData[`display_${header.key}`] || value;
      
      td.textContent = displayValue === null ? '-' : displayValue;
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

document.addEventListener('DOMContentLoaded', () => {
  initializeSidebar();
  renderAllGames();
});
