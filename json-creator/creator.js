document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('game-form');
    const categoriesContainer = document.getElementById('categories');
    const output = document.getElementById('output');
    const previewTable = document.getElementById('preview-table');

    let currentHeaders = [];
    let currentRows = [];

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
                
                <label for="header-row">Headers (comma-separated):</label>
                <input type="text" class="header-row" placeholder="Time, Like?, Notes, Date, Completed" required>
                
                <div class="table-rows"></div>
                <button type="button" class="add-row">Add Row</button>
                <button type="button" class="remove-subcategory">Remove Subcategory</button>
            `;
            subcategoriesContainer.appendChild(subcategory);

            // Update headers and preview when headers change
            const headerInput = subcategory.querySelector('.header-row');
            headerInput.addEventListener('input', () => {
                currentHeaders = headerInput.value.split(',').map(h => h.trim());
                updatePreview();
            });
        }
    });

    // Add row to the table
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-row')) {
            const tableRowsContainer = event.target.previousElementSibling;
            const row = document.createElement('div');
            row.className = 'table-row';

            currentHeaders.forEach((header) => {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.placeholder = header;
                row.appendChild(cell);
            });

            tableRowsContainer.appendChild(row);
            currentRows.push(row);
            updatePreview();
        }
    });

    // Remove category, subcategory, or row
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-category')) {
            event.target.parentElement.remove();
            updatePreview();
        }
        if (event.target.classList.contains('remove-subcategory')) {
            event.target.parentElement.remove();
            updatePreview();
        }
        if (event.target.classList.contains('remove-row')) {
            event.target.parentElement.remove();
            currentRows = currentRows.filter(row => row !== event.target.parentElement);
            updatePreview();
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
                const headers = subcategory.querySelector('.header-row').value.split(',').map(h => h.trim());
                const rows = [];
                Array.from(subcategory.querySelectorAll('.table-row')).forEach(row => {
                    const rowData = {};
                    Array.from(row.querySelectorAll('input')).forEach((input, index) => {
                        rowData[headers[index]] = input.value || 'N/A';
                    });
                    rows.push(rowData);
                });
                subcategories[subcategoryName] = { headers, rows };
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

    // Update live preview
    function updatePreview() {
        previewTable.innerHTML = '';
        if (currentHeaders.length === 0) return;

        const table = document.createElement('table');
        table.className = 'preview-table';

        // Add headers
        const headerRow = document.createElement('tr');
        currentHeaders.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Add rows
        currentRows.forEach(row => {
            const tr = document.createElement('tr');
            Array.from(row.querySelectorAll('input')).forEach(input => {
                const td = document.createElement('td');
                td.textContent = input.value || 'N/A';
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        previewTable.appendChild(table);
    }
});