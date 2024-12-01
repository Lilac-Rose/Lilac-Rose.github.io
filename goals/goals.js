document.addEventListener("DOMContentLoaded", () => {
    const sheets = [
        { gid: '0', name: 'Home' },
        { gid: '1819399209', name: 'Celeste Speedrunning' },
        { gid: '1244868216', name: 'Celeste Speedrunning Splits' },
        { gid: '1714318174', name: 'Celeste 202' },
        { gid: '987324777', name: 'Strawberry Jam Max%' },
        { gid: '240945820', name: 'Hollow Knight' },
        { gid: '1167505070', name: 'Overwatch Achievements' },
        { gid: '817420149', name: 'Terraria' },
        { gid: '1444588187', name: 'Minecraft' },
        { gid: '757560082', name: 'Potion Craft' }
    ];

    const spreadsheetId = '14ChiFwiVvRzHDjyI-u1YcAocVM5b8w3TCu2Yb0VvB0k';

    const fetchData = async () => {
        const allData = [];

        for (let sheet of sheets) {
            const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheet.gid}`;
            try {
                const response = await fetch(url);
                const data = await response.text();
                allData.push({ name: sheet.name, data: parseCSV(data) });
            } catch (error) {
                console.error(`Failed to load data for ${sheet.name}:`, error);
            }
        }

        populateTable(allData);
    };

    const parseCSV = (csv) => {
        const rows = csv.split("\n");
        return rows.map(row => row.split(","));
    };

    const populateTable = (allData) => {
        const tbody = document.querySelector("#goalsTable tbody");
        tbody.innerHTML = '';

        allData.forEach(sheetData => {
            const sheetHeader = document.createElement("tr");
            const headerCell = document.createElement("th");
            headerCell.colSpan = 6;
            headerCell.textContent = sheetData.name;
            sheetHeader.appendChild(headerCell);
            tbody.appendChild(sheetHeader);

            sheetData.data.forEach(row => {
                const tr = document.createElement("tr");
                row.forEach(cell => {
                    const td = document.createElement("td");
                    td.textContent = cell || "-";
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
        });
    };

    fetchData();
});
