// script.js
document.addEventListener("DOMContentLoaded", function () {
    const tabsContainer = document.getElementById("tabs");
    const homeTab = document.getElementById("home");
    const totalGoalsSpan = document.getElementById("total-goals");
    const completedGoalsSpan = document.getElementById("completed-goals");
    const totalProgress = document.getElementById("total-progress");

    let totalGoals = 0;
    let completedGoals = 0;

    // Fetch JSON files from the "data" folder
    fetch("./data/")
        .then(response => response.text())
        .then(text => {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text, "text/html");
            const jsonFiles = Array.from(htmlDocument.querySelectorAll("a"))
                .filter(a => a.href.endsWith(".json"))
                .map(a => a.href);

            jsonFiles.forEach(file => {
                fetch(file)
                    .then(response => response.json())
                    .then(data => {
                        // Create a tab for the JSON file
                        const tabName = file.split("/").pop().replace(".json", "");
                        const tabButton = document.createElement("button");
                        tabButton.className = "tab-link";
                        tabButton.textContent = `[${tabName}]`;
                        tabButton.onclick = () => openTab(tabName);
                        tabsContainer.appendChild(tabButton);

                        // Create a content div for the tab
                        const tabContent = document.createElement("div");
                        tabContent.id = tabName;
                        tabContent.className = "tab-content";
                        document.body.appendChild(tabContent);

                        // Parse and display the JSON data
                        displayData(data, tabContent);

                        // Update home tab stats
                        updateHomeStats(data);
                    });
            });
        });

    function openTab(tabName) {
        const tabContents = document.querySelectorAll(".tab-content");
        tabContents.forEach(tab => tab.style.display = "none");

        const tabLinks = document.querySelectorAll(".tab-link");
        tabLinks.forEach(link => link.classList.remove("active"));

        document.getElementById(tabName).style.display = "block";
        document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add("active");
    }

    function displayData(data, container) {
        const gameName = data.Game;
        const categories = data.Categories;

        const title = document.createElement("h2");
        title.textContent = `[${gameName}]`;
        container.appendChild(title);

        categories.forEach(category => {
            const categoryName = category.Name;
            const subcategories = category.Subcategories;

            const categoryHeader = document.createElement("h3");
            categoryHeader.textContent = `>> ${categoryName}`;
            container.appendChild(categoryHeader);

            subcategories.forEach(subcategory => {
                const subcategoryName = subcategory.Name;
                const rows = subcategory.Rows;
                const columns = subcategory.Columns;
                const columnHeaders = subcategory.ColumnHeaders;
                const subcategoryData = subcategory.Data;

                const subcategoryHeader = document.createElement("h4");
                subcategoryHeader.textContent = `>>> ${subcategoryName}`;
                container.appendChild(subcategoryHeader);

                const table = document.createElement("table");
                const thead = document.createElement("thead");
                const tbody = document.createElement("tbody");

                // Create table headers
                const headerRow = document.createElement("tr");
                columnHeaders.forEach(header => {
                    const th = document.createElement("th");
                    th.textContent = header;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Create table rows
                subcategoryData.forEach(rowData => {
                    const row = document.createElement("tr");
                    rowData.forEach(cellData => {
                        const td = document.createElement("td");
                        td.textContent = cellData;
                        row.appendChild(td);
                    });
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);

                container.appendChild(table);
            });
        });
    }

    function updateHomeStats(data) {
        data.Categories.forEach(category => {
            category.Subcategories.forEach(subcategory => {
                subcategory.Data.forEach(row => {
                    totalGoals++;
                    if (row[1] === "✓") completedGoals++;
                });
            });
        });

        totalGoalsSpan.textContent = totalGoals;
        completedGoalsSpan.textContent = completedGoals;
        totalProgress.value = (completedGoals / totalGoals) * 100;
    }

    // Default to home tab
    openTab("home");
});