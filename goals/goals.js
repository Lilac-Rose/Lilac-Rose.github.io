const SHEET_ID = "16lWlwHzF9l86O_PM5I-IxQGSnl1OiH6zFj5Vn-QW5Ow"; 
const SHEET_NAME = "Sheet1";

document.documentElement.style.setProperty('--container-width', '1600px');

const GAME_TIMES = {
  "Celeste": 1019.4,
  "Hollow Knight": 191.1
};

let gameStats = {
  totalGoals: { completed: 0, total: 0 },
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
      "Bosses": "B33:C48",
      "Equipment": "B51:C57",
      "Spells": "B60:C65",
      "Dream Nail": "B68:C70",
      "Nail Upgrades": "B73:C76",
      "Nail Arts": "B79:C81",
      "Dreamers": "B84:C94",
      "Charms": "B97:C136",
      "Godhome": "B139:C143",
      "Vessel Fragments": "B146:C154",
      "Colosseum": "B157:C159",
      "Mask Shards": "B162:C177"
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
  resetStats();
  initializeTabs();
  
  document.getElementById('home-content').classList.add('active');
  updateHomeStats();
  updateTerminalDate();
  setInterval(updateTerminalDate, 1000);
}

function initializeTabs() {
  const tabs = document.querySelectorAll('.game-tab');
  const categories = document.getElementById('categories');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      
      document.querySelectorAll('.game-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
      });
      
      document.querySelectorAll('.game-section').forEach(section => {
        section.style.display = 'none';
      });
      
      tab.classList.add('active');
      
      const gameName = tab.dataset.game;
      
      if (gameName === 'home') {
        const homeContent = document.getElementById('home-content');
        homeContent.classList.add('active');
        homeContent.style.display = 'block';
        categories.style.display = 'none';
      } else {
        document.getElementById('home-content').style.display = 'none';
        categories.style.display = 'block';
        
        const gameSection = document.querySelector(`.game-section[data-game="${gameName}"]`);
        if (gameSection) {
          gameSection.style.display = 'block';
        }
      }
    });
  });
  
  // Initialize with home tab active
  const homeTab = document.querySelector('.game-tab[data-game="home"]');
  if (homeTab) {
    homeTab.click();
  }
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

function calculateWeightedProgress(categoryName, completed, total) {
  const categoryData = games["Hollow Knight"].categories[categoryName];
  if (!categoryData || !categoryData.maxPercent) return 0;
  
  const maxPercent = categoryData.maxPercent;
  return (completed / total) * maxPercent;
}

function calculateCategoryStats(gameName, categoryName, formattedData) {
  let completed = 0;
  let total = formattedData.length;

  completed = formattedData.reduce((count, item) => {
    const hasCheckmark = Object.values(item).some(value => 
      typeof value === 'string' && value.includes('✓')
    );
    return count + (hasCheckmark ? 1 : 0);
  }, 0);

  return { completed, total };
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

function createProgressBar(stats) {
  const { completed = 0, total = 0 } = stats;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  const container = document.createElement('div');
  container.className = 'progress-container';
  
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  bar.style.width = `${percentage}%`;
  
  const text = document.createElement('div');
  text.className = 'progress-text';
  text.textContent = `${completed} / ${total}`;
  
  container.appendChild(bar);
  container.appendChild(text);
  return container;
}


function updateHomeStats() {
  const totalGoalsDiv = document.getElementById('total-goals');
  if (totalGoalsDiv) {
    const { completed, total } = gameStats.totalGoals;
    totalGoalsDiv.textContent = `${completed} / ${total}`;
  }

  const totalTimeDiv = document.getElementById('total-time');
  if (totalTimeDiv) {
    const totalTime = Object.values(GAME_TIMES).reduce((sum, time) => sum + time, 0);
    totalTimeDiv.textContent = totalTime.toFixed(1);
  }
}

function processGameData(gameName, formattedData) {
  const categoryStats = calculateCategoryStats(gameName, null, formattedData);
  
    if (!formattedData.some(item => item._counted)) {
      gameStats.totalGoals.completed += categoryStats.completed;
      gameStats.totalGoals.total += categoryStats.total;
      
      formattedData.forEach(item => item._counted = true);
    }
  
  updateHomeStats();
  
  return categoryStats;
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
  if (!gameSection) {
    console.error('Game section not found for:', gameName);
    return;
  }
  
  const loadingDiv = showLoading(gameSection);

  try {
    const response = await fetchAndFormatData(SHEET_ID, SHEET_NAME, range);
    loadingDiv.remove();

    if (!response || !response.formattedData) {
      console.error('No formatted data received for category:', categoryName);
      return;
    }

    const { headers, formattedData } = response;
    console.log('Received data for category', categoryName, ':', formattedData);

    const categoryStats = calculateCategoryStats(gameName, categoryName, formattedData);
    processGameData(gameName, formattedData);

    const categorySection = await createCategorySection(categoryName, headers, formattedData, categoryStats);
    if (categorySection && parentElement) {
      parentElement.appendChild(categorySection);
    } else {
      console.error('Failed to append category section:', 
        categorySection ? 'parentElement missing' : 'categorySection creation failed');
    }

  } catch (error) {
    console.error('Error rendering category:', error);
    loadingDiv.remove();
    showError(`Failed to load ${categoryName}`);
  }
}

function updateOverallStats() {
  const overallStats = document.getElementById("overall-stats");
  overallStats.innerHTML = '';
  overallStats.appendChild(createProgressBar(totalStats.completed, totalStats.total));
}

async function renderDataForGame(gameName, gameData) {
  console.log('Rendering game:', gameName);
  const container = document.getElementById("categories");
  if (!container) {
    console.error('Categories container not found');
    return;
  }

  const gameSection = document.createElement("div");
  gameSection.classList.add("game-section");
  gameSection.setAttribute("data-game", gameName);

  const gameHeader = document.createElement("div");
  gameHeader.classList.add("game-header", "collapsible-header");

  const titleStatsContainer = document.createElement("div");
  titleStatsContainer.classList.add("title-stats-container");

  const gameTitle = document.createElement("h2");
  gameTitle.textContent = gameName;
  titleStatsContainer.appendChild(gameTitle);

  if (gameData.timeSpent) {
    const timeDisplay = createTimeDisplay(gameData.timeSpent);
    if (timeDisplay) {
      titleStatsContainer.appendChild(timeDisplay);
    }
  }

  gameHeader.appendChild(titleStatsContainer);

  const gameStatsDiv = document.createElement("div");
  gameStatsDiv.classList.add("game-stats");
  gameStatsDiv.dataset.stats = JSON.stringify({ completed: 0, total: 0 });
  
  const progressBar = createProgressBar({ completed: 0, total: 0 });
  if (progressBar) {
    gameStatsDiv.appendChild(progressBar);
  }
  gameHeader.appendChild(gameStatsDiv);

  gameSection.appendChild(gameHeader);
  
  const gameContent = document.createElement("div");
  gameContent.classList.add("collapsible-content");
  gameSection.appendChild(gameContent);
  
  container.appendChild(gameSection);

  // Process each category
  for (const [categoryName, categoryData] of Object.entries(gameData.categories)) {
    const range = typeof categoryData === 'string' ? categoryData : categoryData.range;
    await renderDataForCategory(gameName, categoryName, range, gameContent);
  }

  // Update the game's progress bar with final stats
  const finalStats = JSON.parse(gameStatsDiv.dataset.stats);
  gameStatsDiv.innerHTML = '';
  const finalProgressBar = createProgressBar(finalStats);
  if (finalProgressBar) {
    gameStatsDiv.appendChild(finalProgressBar);
  }
  
  updateHomeStats();
}

async function renderGame(gameName, gameData) {
  const container = document.getElementById('categories');
  
  const gameContent = document.createElement('div');
  gameContent.className = 'game-content';
  gameContent.dataset.game = gameName;
  gameContent.style.display = 'none';
  
  const gameSection = document.createElement('div');
  gameSection.className = 'game-section';
  
  const header = document.createElement('div');
  header.className = 'game-header';
  header.innerHTML = `
      <h2>${gameName}</h2>
      ${gameData.timeSpent ? `<div class="time-display">${gameData.timeSpent} hours</div>` : ''}
  `;
  gameSection.appendChild(header);
  
  // Update total time
  if (gameData.timeSpent) {
    document.getElementById('total-time').textContent = 
      (parseFloat(document.getElementById('total-time').textContent || 0) + gameData.timeSpent).toFixed(1);
  }
  
  // Create a container for all categories
  const categoriesContainer = document.createElement('div');
  categoriesContainer.className = 'categories-container';
  
  // Process each category
  for (const [categoryName, categoryData] of Object.entries(gameData.categories)) {
    const range = typeof categoryData === 'string' ? categoryData : categoryData.range;
    
    try {
      const formattedData = await fetchAndFormatData(SHEET_ID, SHEET_NAME, range);
      
      if (formattedData && formattedData.formattedData) {
        // Calculate stats for this category
        const categoryStats = calculateCategoryStats(gameName, categoryName, formattedData.formattedData);
        
        // Update game stats based on category completion
        if (gameName === "Hollow Knight") {
          gameStats.hollowKnight.completed += categoryStats.rawCompleted;
        } else {
          gameStats.totalGoals.completed += categoryStats.rawCompleted;
          gameStats.totalGoals.total += categoryStats.rawTotal;
        }
        
        // Create and append the category section
        const categorySection = await createCategorySection(
          categoryName, 
          formattedData.headers, 
          formattedData.formattedData,
          categoryStats
        );
        categoriesContainer.appendChild(categorySection);
      }
    } catch (error) {
      console.error(`Error processing category ${categoryName} for ${gameName}:`, error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = `Failed to load ${categoryName}`;
      categoriesContainer.appendChild(errorDiv);
    }
  }
  
  gameSection.appendChild(categoriesContainer);
  gameContent.appendChild(gameSection);
  container.appendChild(gameContent);
  
  // Update home stats after processing all categories
  updateHomeStats();
}

async function createCategorySection(categoryName, headers, formattedData, categoryStats) {
  const categorySection = document.createElement('div');
  categorySection.className = 'category-section';
  
  const header = document.createElement('div');
  header.className = 'category-header';
  
  const title = document.createElement('h3');
  title.textContent = categoryName;
  title.setAttribute('data-category', categoryName);
  header.appendChild(title);
  
  // Add progress bar if categoryStats exists
  if (categoryStats) {
    const progressBar = createProgressBar(categoryStats);
    if (progressBar) {
      header.appendChild(progressBar);
    }
  }
  
  categorySection.appendChild(header);
  
  // Only create table if we have valid data
  if (headers && headers.length && formattedData && formattedData.length) {
    const table = document.createElement('table');
    
    // Add headers
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      // Handle both string and object header formats
      th.textContent = typeof header === 'string' ? header : (header.label || '');
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Add data rows
    const tbody = document.createElement('tbody');
    formattedData.forEach(row => {
      const tr = document.createElement('tr');
      headers.forEach(header => {
        const td = document.createElement('td');
        // Get the key based on header type
        const key = typeof header === 'string' 
          ? header.toLowerCase().replace(/\s+/g, '_')
          : (header.key || header.label?.toLowerCase().replace(/\s+/g, '_'));
        td.textContent = row[key] || '';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    categorySection.appendChild(table);
  }
  
  return categorySection;
}

function resetStats() {
  gameStats = {
    totalGoals: { completed: 0, total: 0 },
    hollowKnight: { completed: 0, total: 112 },
    totalTime: 0
  };
  
  // Reset displayed stats
  document.getElementById('total-time').textContent = '0';
  document.getElementById('total-goals').textContent = '0 / 0';
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

document.addEventListener('DOMContentLoaded', async () => {
  await initializeTracker();
  
  await renderAllGames();
  
  document.querySelectorAll('.game-section').forEach(section => {
    section.style.display = 'none';
  });
});
