document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('game-form');
    const categoriesContainer = document.getElementById('categories');
    const output = document.getElementById('output');

    // Add category field
    document.getElementById('add-category').addEventListener('click', () => {
        const category = document.createElement('div');
        category.className = 'category';
        category.innerHTML = `
            <h3>Category</h3>
            <label for="category-name">Category Name:</label>
            <input type="text" class="category-name" required>
            <div class="subcategories"></div>
            <button type="button" class="add-subcategory">Add Subcategory</button>
            <button type="button" class="remove-category">Remove Category</button>
        `;
        categoriesContainer.appendChild(category);
    });

    // Add subcategory field
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-subcategory')) {
            const subcategoriesContainer = event.target.previousElementSibling;
            const subcategory = document.createElement('div');
            subcategory.className = 'subcategory';
            subcategory.innerHTML = `
                <h4>Subcategory</h4>
                <label for="subcategory-name">Subcategory Name:</label>
                <input type="text" class="subcategory-name" required>
                <div class="table-container">
                    <div class="table-header">
                        <label for="header-row">Header Row:</label>
                        <input type="text" class="header-row" placeholder="Comma-separated headers (e.g., Time, Like?, Notes, Date)" required>
                    </div>
                    <div class="table-rows"></div>
                    <button type="button" class="add-row">Add Row</button>
                </div>
                <button type="button" class="remove-subcategory">Remove Subcategory</button>
            `;
            subcategoriesContainer.appendChild(subcategory);
        }
    });

    // Add row to the table
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-row')) {
            const tableRowsContainer = event.target.previousElementSibling;
            const headerRow = tableRowsContainer.previousElementSibling.querySelector('.header-row').value;
            const headers = headerRow.split(',').map((header) => header.trim());

            const row = document.createElement('div');
            row.className = 'table-row';
            headers.forEach((header) => {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.placeholder = header;
                row.appendChild(cell);
            });
            tableRowsContainer.appendChild(row);
        }
    });

    // Remove category, subcategory, or row
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-category')) {
            event.target.parentElement.remove();
        }
        if (event.target.classList.contains('remove-subcategory')) {
            event.target.parentElement.remove();
        }
        if (event.target.classList.contains('remove-row')) {
            event.target.parentElement.remove();
        }
    });

    // Generate JSON
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const gameName = document.getElementById('game-name').value;
        const gameHours = document.getElementById('game-hours').value;

        const categories = {};
        Array.from(document.querySelectorAll('.category')).forEach(category => {
            const categoryName = category.querySelector('.category-name').value;
            const subcategories = {};
            Array.from(category.querySelectorAll('.subcategory')).forEach(subcategory => {
                const subcategoryName = subcategory.querySelector('.subcategory-name').value;
                const headerRow = subcategory.querySelector('.header-row').value;
                const headers = headerRow.split(',').map((header) => header.trim());
                const rows = [];
                Array.from(subcategory.querySelectorAll('.table-row')).forEach(row => {
                    const rowData = Array.from(row.querySelectorAll('input')).map((input) => input.value);
                    rows.push(rowData);
                });
                subcategories[subcategoryName] = {
                    headers: headers,
                    rows: rows
                };
            });
            categories[categoryName] = subcategories;
        });

        const gameData = {
            game: gameName,
            hours: parseInt(gameHours, 10),
            categories: categories
        };

        output.textContent = JSON.stringify(gameData, null, 2);
    });
});