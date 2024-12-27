const SHEET_ID = "16lWlwHzF9l86O_PM5I-IxQGSnl1OiH6zFj5Vn-QW5Ow"; 
const SHEET_NAME = "Sheet1";

document.documentElement.style.setProperty('--container-width', '1600px');

const GAME_TIMES = {
  "Celeste": 1019.4,
  "Hollow Knight": 191.1
};

let gameStats = {
  totalGoals: { completed: 0, total: 0 },
  hollowKnight: { completed: 0, total: 112 },
  totalTime: 0
};

const games = {
  "Celeste": {
    background: "../images/celeste-background.jpg",
    timeSpent: GAME_TIMES["Celeste"],
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
  },
  "Hollow Knight": {
    background: "../images/hollow-knight-background.jpg",
    timeSpent: GAME_TIMES["Hollow Knight"],
    categories: {
      "Bosses": { range: "B33:C48", maxPercent: 16 },
      "Equipment": { range: "B51:C57", maxPercent: 14 },
      "Spells": { range: "B60:C65", maxPercent: 6 },
      "Dream Nail": { range: "B68:C70", maxPercent: 3 },
      "Nail Upgrades": { range: "B73:C76", maxPercent: 4 },
      "Nail Arts": { range: "B79:C81", maxPercent: 3 },
      "Dreamers": { range: "B84:C94", maxPercent: 11 },
      "Charms": { range: "B97:C136", maxPercent: 40 },
      "Godhome": { range: "B139:C143", maxPercent: 5 },
      "Vessel Fragments": { range: "B146:C154", maxPercent: 3 },
      "Colosseum": { range: "B157:C159", maxPercent: 3 },
      "Mask Shards": { range: "B162:C177", maxPercent: 4 }
    }
  }
};

function createTimeDisplay(timeSpent) {
  if (!timeSpent) return null;
  
  const timeContainer = document.createElement('div');
  timeContainer.classList.add('time-display');
  
  const timeLabel = document.createElement('span');
  timeLabel.classList.add('time-label');
  timeLabel.textContent = 'Time: ';
  
  const timeValue = document.createElement('span');
  timeValue.classList.add('time-value');
  timeValue.textContent = `${timeSpent} hours`;
  
  timeContainer.appendChild(timeLabel);
  timeContainer.appendChild(timeValue);
  return timeContainer;
}

async function initializeTracker() {
  // Reset stats
  gameStats = {
    totalGoals: { completed: 0, total: 0 },
    hollowKnight: { completed: 0, total: 112 },
    totalTime: 0
  };
  
  // Initialize tabs
  initializeTabs();
  
  // Render all games
  for (const [gameName, gameData] of Object.entries(games)) {
    await renderGame(gameName, gameData);
  }
  
  // Show home content initially
  document.getElementById('home-content').classList.add('active');
  updateHomeStats();

  updateTerminalDate();
  setInterval(updateTerminalDate, 1000);
}

function initializeTabs() {
  const tabs = document.querySelectorAll('.game-tab');
  
  tabs.forEach(tab => {
      tab.addEventListener('click', () => {
          // Remove active class from all tabs
          tabs.forEach(t => t.classList.remove('active'));
          
          // Add active class to clicked tab
          tab.classList.add('active');
          
          // Hide all game content
          document.querySelectorAll('.game-content').forEach(content => {
              content.classList.remove('active');
          });
          
          // Show appropriate content
          const gameName = tab.dataset.game;
          if (gameName === 'home') {
              document.getElementById('home-content').classList.add('active');
          } else {
              // Find the corresponding game content
              const gameContent = document.querySelector(`.game-content[data-game="${gameName}"]`);
              if (gameContent) {
                  gameContent.classList.add('active');
              }
          }
      });
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Improved completion check function
function checkCompletion(item) {
  if (typeof item === 'string') {
    return item.includes('✓');
  }
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

function calculateWeightedProgress(category, completedItems, totalItems) {
  const weights = {
    "Equipment": 2,
    "Vessel Fragments": 1/3, 
    "Mask Shards": 1/4,
  };

  const weight = weights[category] || 1;
  return completedItems * weight;
}

function calculateCategoryStats(gameName, categoryName, formattedData) {
  // Only use percentage calculations for Hollow Knight
  if (gameName === "Hollow Knight") {
    const completed = formattedData.reduce((count, item) => {
      const hasCheckmark = Object.values(item).some(value => 
        typeof value === 'string' && value.includes('✓')
      );
      return count + (hasCheckmark ? 1 : 0);
    }, 0);

    const total = formattedData.length;
    const weightedCompleted = calculateWeightedProgress(categoryName, completed, total);
    
    const maxPercentages = {
      "Bosses": 16,
      "Equipment": 14,
      "Spells": 6,
      "Dream Nail": 3,
      "Nail Upgrades": 4,
      "Nail Arts": 3,
      "Dreamers": 11,
      "Charms": 40,
      "Godhome": 5,
      "Vessel Fragments": 3,
      "Colosseum": 3,
      "Mask Shards": 4
    };

    return {
      completed: weightedCompleted,
      total: maxPercentages[categoryName] || total,
      rawCompleted: completed,
      rawTotal: total,
      isPercentage: true
    };
  } else {
    const completed = formattedData.reduce((count, item) => {
      const hasCheckmark = Object.values(item).some(value => 
        typeof value === 'string' && value.includes('✓')
      );
      return count + (hasCheckmark ? 1 : 0);
    }, 0);

    return {
      completed,
      total: formattedData.length,
      rawCompleted: completed,
      rawTotal: formattedData.length,
      isPercentage: false
    };
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

function createProgressBar(stats, isPercentage = false) {
  const { completed, total } = stats;
  const percentage = (completed / total) * 100;
  
  const container = document.createElement('div');
  container.className = 'progress-container';
  
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  bar.style.width = `${percentage}%`;
  
  const text = document.createElement('div');
  text.className = 'progress-text';
  
  if (isPercentage) {
    text.textContent = `${completed}% / ${total}%`;
  } else {
    text.textContent = `${completed} / ${total}`;
  }
  
  container.appendChild(bar);
  container.appendChild(text);
  return container;
}

function updateHomeStats() {
  // Update total time
  const totalTimeDiv = document.getElementById('total-time');
  const totalTime = Object.values(GAME_TIMES).reduce((acc, time) => acc + time, 0);
  if (totalTimeDiv) {
      totalTimeDiv.textContent = totalTime.toFixed(1);
  }
  
  // Update total goals (excluding Hollow Knight)
  const totalGoalsDiv = document.getElementById('total-goals');
  totalGoalsDiv.innerHTML = '';
  totalGoalsDiv.appendChild(createProgressBar(gameStats.totalGoals));
  
  // Update Hollow Knight progress
  const hollowKnightDiv = document.getElementById('hollow-knight-progress');
  hollowKnightDiv.innerHTML = '';
  hollowKnightDiv.appendChild(createProgressBar(gameStats.hollowKnight, true));
}

function processGameData(gameName, formattedData, categoryName) {
  const completed = formattedData.reduce((count, item) => {
    const hasCheckmark = Object.values(item).some(value => 
      typeof value === 'string' && value.includes('✓')
    );
    return count + (hasCheckmark ? 1 : 0);
  }, 0);
  
  const total = formattedData.length;
  
  if (gameName === "Hollow Knight") {
    const percentageProgress = calculateHollowKnightProgress(categoryName, completed, total);
    gameStats.hollowKnight.completed += percentageProgress;
  } else {
    gameStats.totalGoals.completed += completed;
    gameStats.totalGoals.total += total;
  }
}

function calculateHollowKnightProgress(category, completed, total) {
  const categoryData = games["Hollow Knight"].categories[category];
  if (!categoryData || !categoryData.maxPercent) return 0;
  
  return (completed / total) * categoryData.maxPercent;
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

  // Count completed items by checking all fields for checkmarks
  const categoryStats = {
    completed: formattedData.reduce((count, item) => {
      const hasCheckmark = Object.values(item).some(value => 
        typeof value === 'string' && value.includes('✓')
      );
      return count + (hasCheckmark ? 1 : 0);
    }, 0),
    total: formattedData.length
  };

  const gameStatsDiv = gameSection.querySelector('.game-stats');
  const currentGameStats = JSON.parse(gameStatsDiv.dataset.stats);
  currentGameStats.completed += categoryStats.completed;
  currentGameStats.total += categoryStats.total;
  gameStatsDiv.dataset.stats = JSON.stringify(currentGameStats);
  gameStatsDiv.innerHTML = '';
  gameStatsDiv.appendChild(createProgressBar(currentGameStats.completed, currentGameStats.total));

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
  categoryProgress.appendChild(createProgressBar(categoryStats.completed, categoryStats.total));
  categoryHeader.appendChild(categoryProgress);

  categorySection.appendChild(categoryHeader);

  const categoryContent = document.createElement("div");
  categoryContent.classList.add("collapsible-content");
  
  // Optimized table creation
  const table = document.createElement("table");
  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headerFragment = document.createDocumentFragment();

  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header.label;
    th.style.width = `${100 / headers.length}%`;
    headerFragment.appendChild(th);
  });

  headerRow.appendChild(headerFragment);
  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");
  const rowFragment = document.createDocumentFragment();

  formattedData.forEach(rowData => {
    const row = document.createElement("tr");
    headers.forEach(header => {
      const td = document.createElement("td");
      const value = rowData[header.key];
      const displayValue = rowData[`display_${header.key}`] || value;
      td.textContent = displayValue === null ? '-' : displayValue;
      rowFragment.appendChild(row);
      row.appendChild(td);
    });
  });

  tableBody.appendChild(rowFragment);
  table.appendChild(tableBody);
  categoryContent.appendChild(table);
  categorySection.appendChild(categoryContent);
  parentElement.appendChild(categorySection);
}

function updateOverallStats() {
  const overallStats = document.getElementById("overall-stats");
  overallStats.innerHTML = '';
  overallStats.appendChild(createProgressBar(totalStats.completed, totalStats.total));
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
    if (!e.target.closest('.game-stats') && !e.target.closest('.time-display')) {
      toggleCollapse(gameSection);
    }
  });

  // Create title and stats container
  const titleStatsContainer = document.createElement("div");
  titleStatsContainer.classList.add("title-stats-container");

  const gameTitle = document.createElement("h2");
  gameTitle.textContent = gameName;
  titleStatsContainer.appendChild(gameTitle);

  // Add time display
  const timeDisplay = createTimeDisplay(GAME_TIMES[gameName]);
  titleStatsContainer.appendChild(timeDisplay);

  gameHeader.appendChild(titleStatsContainer);

  const gameStats = document.createElement("div");
  gameStats.classList.add("game-stats");
  gameStats.dataset.stats = JSON.stringify({ completed: 0, total: 0 });
  gameStats.appendChild(createProgressBar(0, 0));
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

async function renderGame(gameName, gameData) {

  const container = document.querySelector(`.game-content[data-game="${gameName}"]`);
  if (!container) return;
  
  // Clear existing content
  container.innerHTML = '';
  
  const gameSection = document.createElement('div');
  gameSection.className = 'game-section';

  const gameContent = document.createElement('div');
  gameContent.className = 'game-content';
  gameContent.dataset.game = gameName;
  
  gameSection.className = 'game-section';
  
  const header = document.createElement('div');
  header.className = 'game-header';
  header.innerHTML = `
    <h2>${gameName}</h2>
    ${gameData.timeSpent ? `<div class="time-display">${gameData.timeSpent} hours</div>` : ''}
  `;
  gameSection.appendChild(header);
  
  gameStats.totalTime += gameData.timeSpent || 0;
  
  for (const [categoryName, categoryData] of Object.entries(gameData.categories)) {
    const range = typeof categoryData === 'string' ? categoryData : categoryData.range;
    await renderDataForCategory(gameName, categoryName, range, gameSection);
  }
  
  gameContent.appendChild(gameSection);
  container.appendChild(gameContent);
  container.appendChild(gameSection);
  updateHomeStats();
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
  overallStats.appendChild(createProgressBar(0, 0));
  overallStatsContainer.appendChild(overallStats);

  container.appendChild(overallStatsContainer);

  totalStats = { completed: 0, total: 0 };

  for (const [gameName, gameData] of Object.entries(games)) {
    await renderDataForGame(gameName, gameData);
  }
}

function updateTerminalDate() {
  const now = new Date();
  
  // Format the date as YYYY.MM.DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Format the time as HH:MM:SS
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  // Combine into SIGNALIS style format
  const dateString = `${year}.${month}.${day}`;
  const timeString = `${hours}:${minutes}:${seconds}`;
  
  // Update the date display
  const dateDisplay = document.querySelector('.report-header');
  if (dateDisplay) {
      dateDisplay.textContent = `DIAGNOSTIC REPORT [${dateString}] ${timeString}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeTracker();
  renderAllGames();
});