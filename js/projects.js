document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    const projectsContainer = document.getElementById('projectsContainer');

    if (projectsContainer) {
        projectsContainer.style.display = 'block';
    }

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.backgroundColor = '#4e035f';
        });

        card.addEventListener('mouseleave', () => {
            card.style.backgroundColor = '#3d024c';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
