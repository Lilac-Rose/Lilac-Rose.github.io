const SHEET_ID = "your-sheet-id"; // Replace with your Google Sheet ID
const SHEET_NAME = "Sheet1"; // Replace with your Google Sheet Name

// Define games with categories and their ranges
const games = {
  "Game 1": {
    "Category A": "A1:E5", // Adjust range based on your sheet
    "Category B": "A6:E10",
  },
  "Game 2": {
    "Category X": "F1:J5",
    "Category Y": "F6:J10",
  },
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
    console.error(error);
  }
}

async function renderDataForCategory(gameName, categoryName, range) {
  const formattedData = await fetchAndFormatData(SHEET_ID, SHEET_NAME, range);

  if (!formattedData) return;

  const gameSection = document.querySelector(`.game-section[data-game="${gameName}"]`);

  // Create a section for the category
  const categorySection = document.createElement("div");
  categorySection.classList.add("category-section");

  const categoryTitle = document.createElement("h3");
  categoryTitle.textContent = categoryName;
  categorySection.appendChild(categoryTitle);

  // Create a table to display goals
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
      <td>${completed ? "True" : "False"}</td>
      <td>${timeTaken}</td>
      <td>${enjoyment}</td>
    `;
    
    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  categorySection.appendChild(table);
  gameSection.appendChild(categorySection);
}

async function renderDataForGame(gameName, categories) {
  const container = document.getElementById("categories");

  // Create a section for the game
  const gameSection = document.createElement("div");
  gameSection.classList.add("game-section");
  gameSection.setAttribute("data-game", gameName);

  const gameTitle = document.createElement("h2");
  gameTitle.textContent = gameName;
  gameSection.appendChild(gameTitle);

  container.appendChild(gameSection);

  // Render each category
  for (const [categoryName, range] of Object.entries(categories)) {
    await renderDataForCategory(gameName, categoryName, range);
  }
}

async function renderAllGames() {
  const container = document.getElementById("categories");
  container.innerHTML = ""; // Clear previous content

  for (const [gameName, categories] of Object.entries(games)) {
    await renderDataForGame(gameName, categories);
  }
}

// Call the function to render all games
renderAllGames();
