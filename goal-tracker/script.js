document.addEventListener('DOMContentLoaded', () => {
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
    fetch('/goal-tracker/data')
        .then((response) => response.text())
        .then((html) => {
            // Parse the HTML response to extract JSON file names
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'))
                .map((link) => link.href)
                .filter((href) => href.endsWith('.json'))
                .map((href) => href.split('/').pop());

            // Fetch each game's data
            const fetchPromises = links.map((file) =>
                fetch(`/goal-tracker/data/${file}`).then((response) => response.json())
            );

            Promise.all(fetchPromises).then((gameData) => {
                games = gameData;

                // Calculate total hours and goals
                games.forEach((game) => {
                    totalHours += game.hours || 0;

                    for (const category of Object.values(game.categories)) {
                        category.forEach((item) => {
                            if (item.completed !== undefined) {
                                totalGoals++;
                                if (item.completed) completedGoals++;
                            }
                        });
                    }
                });

                // Update the home page
                totalHoursElement.textContent = totalHours;
                completedGoalsElement.textContent = completedGoals;
                totalGoalsElement.textContent = totalGoals;

                // Create tabs
                createTabs(links);
            });
        })
        .catch((error) => {
            console.error('Error fetching JSON files:', error);
        });

    // Function to create tabs
    function createTabs(links) {
        // Add Home tab
        const homeTab = document.createElement('div');
        homeTab.className = 'tab active';
        homeTab.textContent = 'Home';
        homeTab.addEventListener('click', () => {
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
                showGamePage(games[index]);
                setActiveTab(tab);
            });
            tabsContainer.appendChild(tab);
        });
    }

    // Function to show the home page
    function showHomePage() {
        homeDataElement.classList.add('active');
        gameDataElement.classList.remove('active');
    }

    // Function to show the game page
    function showGamePage(game) {
        gameNameElement.textContent = game.game;
        gameHoursElement.textContent = game.hours || 0;

        // Calculate completed and total goals for the game
        let completed = 0;
        let total = 0;
        for (const category of Object.values(game.categories)) {
            category.forEach((item) => {
                if (item.completed !== undefined) {
                    total++;
                    if (item.completed) completed++;
                }
            });
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
        for (const [category, items] of Object.entries(game.categories)) {
            const categoryHeader = document.createElement('h3');
            categoryHeader.textContent = category;
            gameDataElement.appendChild(categoryHeader);

            const list = document.createElement('ul');
            items.forEach((item) => {
                const li = document.createElement('li');
                li.textContent = formatItem(item);
                list.appendChild(li);
            });
            gameDataElement.appendChild(list);
        }

        homeDataElement.classList.remove('active');
        gameDataElement.classList.add('active');
    }

    // Function to set the active tab
    function setActiveTab(activeTab) {
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