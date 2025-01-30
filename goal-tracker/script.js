document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded.'); // Debugging

    const homeDataElement = document.getElementById('home-data');
    const gameDataElement = document.getElementById('game-data');
    const totalHoursElement = document.getElementById('total-hours');
    const completedGoalsElement = document.getElementById('completed-goals');
    const totalGoalsElement = document.getElementById('total-goals');
    const gameNameElement = document.getElementById('game-name');
    const gameHoursElement = document.getElementById('game-hours');
    const gameCompletedGoalsElement = document.getElementById('game-completed-goals');
    const gameTotalGoalsElement = document.getElementById('game-total-goals');
    const tabsContainer = document.getElementById('tabs');

    let totalHours = 0;
    let completedGoals = 0;
    let totalGoals = 0;
    let games = [];

    // Fetch the list of JSON files in the data folder
    console.log('Fetching JSON files from /goal-tracker/data/...'); // Debugging
    fetch('/data/')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then((html) => {
            console.log('HTML response received:', html); // Debugging

            // Parse the HTML response to extract JSON file names
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'))
                .map((link) => link.href)
                .filter((href) => href.endsWith('.json'))
                .map((href) => href.split('/').pop());

            console.log('Detected JSON files:', links); // Debugging

            if (links.length === 0) {
                console.warn('No JSON files found in /goal-tracker/data/.'); // Debugging
                return;
            }

            // Fetch each game's data
            const fetchPromises = links.map((file) => {
                console.log(`Fetching data for ${file}...`); // Debugging
                return fetch(`/goal-tracker/data/${file}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log(`Data fetched for ${file}:`, data); // Debugging
                        return data;
                    })
                    .catch((error) => {
                        console.error(`Error fetching ${file}:`, error); // Debugging
                        return null;
                    });
            });

            Promise.all(fetchPromises).then((gameData) => {
                games = gameData.filter((game) => game !== null); // Filter out null values

                if (games.length === 0) {
                    console.error('No valid game data found.'); // Debugging
                    return;
                }

                console.log('All game data fetched:', games); // Debugging

                // Calculate total hours and goals
                games.forEach((game) => {
                    totalHours += game.hours || 0;

                    for (const category of Object.values(game.categories)) {
                        for (const subcategory of Object.values(category)) {
                            subcategory.forEach((item) => {
                                if (item.completed !== undefined) {
                                    totalGoals++;
                                    if (item.completed) completedGoals++;
                                }
                            });
                        }
                    }
                });

                console.log('Total hours:', totalHours); // Debugging
                console.log('Completed goals:', completedGoals); // Debugging
                console.log('Total goals:', totalGoals); // Debugging

                // Update the home page
                totalHoursElement.textContent = totalHours;
                completedGoalsElement.textContent = completedGoals;
                totalGoalsElement.textContent = totalGoals;

                // Create tabs
                createTabs(links);
            });
        })
        .catch((error) => {
            console.error('Error fetching JSON files:', error); // Debugging
        });

    // Function to create tabs
    function createTabs(links) {
        console.log('Creating tabs...'); // Debugging

        // Add Home tab
        const homeTab = document.createElement('div');
        homeTab.className = 'tab active';
        homeTab.textContent = 'Home';
        homeTab.addEventListener('click', () => {
            console.log('Home tab clicked.'); // Debugging
            showHomePage();
            setActiveTab(homeTab);
        });
        tabsContainer.appendChild(homeTab);

        // Add game tabs
        links.forEach((file, index) => {
            const tab = document.createElement('div');
            tab.className = 'tab';
            tab.textContent = file.replace('.json', '');
            tab.addEventListener('click', () => {
                console.log(`Tab clicked: ${file}`); // Debugging
                showGamePage(games[index]);
                setActiveTab(tab);
            });
            tabsContainer.appendChild(tab);
        });

        console.log('Tabs created:', links); // Debugging
    }

    // Function to show the home page
    function showHomePage() {
        console.log('Showing home page...'); // Debugging
        homeDataElement.classList.add('active');
        gameDataElement.classList.remove('active');
    }

    // Function to show the game page
    function showGamePage(game) {
        console.log('Showing game page for:', game.game); // Debugging

        gameNameElement.textContent = game.game;
        gameHoursElement.textContent = game.hours || 0;

        // Calculate completed and total goals for the game
        let completed = 0;
        let total = 0;
        for (const category of Object.values(game.categories)) {
            for (const subcategory of Object.values(category)) {
                subcategory.forEach((item) => {
                    if (item.completed !== undefined) {
                        total++;
                        if (item.completed) completed++;
                    }
                });
            }
        }
        gameCompletedGoalsElement.textContent = completed;
        gameTotalGoalsElement.textContent = total;

        // Clear previous data
        gameDataElement.innerHTML = `
            <h2 id="game-name">${game.game}</h2>
            <h3>Hours Played: <span id="game-hours">${game.hours || 0}</span></h3>
            <h3>Goals Completed: <span id="game-completed-goals">${completed}</span> / <span id="game-total-goals">${total}</span></h3>
        `;

        // Loop through categories
        for (const [category, subcategories] of Object.entries(game.categories)) {
            const categoryHeader = document.createElement('h3');
            categoryHeader.textContent = category;
            gameDataElement.appendChild(categoryHeader);

            for (const [subcategory, items] of Object.entries(subcategories)) {
                const subcategoryHeader = document.createElement('h4');
                subcategoryHeader.textContent = subcategory;
                gameDataElement.appendChild(subcategoryHeader);

                const list = document.createElement('ul');
                items.forEach((item) => {
                    const li = document.createElement('li');
                    li.textContent = formatItem(item);
                    list.appendChild(li);
                });
                gameDataElement.appendChild(list);
            }
        }

        homeDataElement.classList.remove('active');
        gameDataElement.classList.add('active');
    }

    // Function to set the active tab
    function setActiveTab(activeTab) {
        console.log('Setting active tab:', activeTab.textContent); // Debugging
        Array.from(tabsContainer.children).forEach((tab) => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }

    // Helper function to format item based on its structure
    function formatItem(item) {
        return Object.entries(item)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
    }
});