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
                <div class="items"></div>
                <button type="button" class="add-item">Add Item</button>
                <button type="button" class="remove-subcategory">Remove Subcategory</button>
            `;
            subcategoriesContainer.appendChild(subcategory);
        }
    });

    // Add item field
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-item')) {
            const itemsContainer = event.target.previousElementSibling;
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <label for="item-key">Key:</label>
                <input type="text" class="item-key" required>
                <label for="item-value">Value:</label>
                <input type="text" class="item-value" required>
                <label for="item-completed">Completed:</label>
                <input type="checkbox" class="item-completed">
                <button type="button" class="remove-item">Remove Item</button>
            `;
            itemsContainer.appendChild(item);
        }
    });

    // Remove category, subcategory, or item field
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-category')) {
            event.target.parentElement.remove();
        }
        if (event.target.classList.contains('remove-subcategory')) {
            event.target.parentElement.remove();
        }
        if (event.target.classList.contains('remove-item')) {
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
                const items = [];
                Array.from(subcategory.querySelectorAll('.item')).forEach(item => {
                    const key = item.querySelector('.item-key').value;
                    const value = item.querySelector('.item-value').value;
                    const completed = item.querySelector('.item-completed').checked;
                    items.push({ [key]: value, completed });
                });
                subcategories[subcategoryName] = items;
            });
            categories[categoryName] = subcategories;
        });

        const gameData = {
            game: gameName,
            hours: parseInt(gameHours, 10),
            categories
        };

        output.textContent = JSON.stringify(gameData, null, 2);
    });
});