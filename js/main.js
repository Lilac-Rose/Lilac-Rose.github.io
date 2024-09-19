document.addEventListener('DOMContentLoaded', function() {
    console.log('hello world!');
   
    var quotes = [
        "Whole worlds pivot on acts of imagination. - Thirteenth Doctor",
        "Letting it get to you. You know what that's called? Being alive. Best thing there is. Being alive right now is all that counts. - Eleventh Doctor",
        "There's no point in being grown up if you can't be childish sometimes. - Fourth Doctor",
        "Human progress isn't measured by industry. It's measured by the value you place on a life. An unimportant life. A life without privilege. The boy who died on the river, that boy's value is your value. That's what defines an age. That's what defines a species. - Twelfth Doctor",
        "I'm not running away from things. I'm running to them before they flare and fade forever. That's all right. Our lives would never remain the same. They can't. One day, soon, maybe, you'll stop. I've known you for a while. - Eleventh Doctor",
        "Some people live more in 20 years than others do in 80. It's not the time that matters, it's the person. - Tenth Doctor",
        "The way I see it, every life is a pile of good things and bad things. The good things don't always soften the bad things, but vice versa, the bad things don't always spoil the good things or make them unimportant. - Eleventh Doctor",
        "Nothing's sad until it's over, and then everything is. - Twelfth Doctor",
        "Love, in all its forms, is the most powerful weapon we have. Because love is a form of hope. And like hope, love abides. In the face of everything - Thirteenth Doctor",
        "We're all stories, in the end. Just make it a good one, eh? - Eleventh Doctor"    
    ];
    var quotesElement = document.getElementById("quotes");
   
    function getRandomQuote() {
        var randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }
   
    function setRandomQuote() {
        if (quotesElement) {
            var quote = getRandomQuote();
            quotesElement.innerHTML = quote;
        } else {
            console.log('quotes element not found');
        }
    }      
   
    setRandomQuote();
   
    if (quotesElement) {
        quotesElement.addEventListener('click', function() {
            setRandomQuote();
        });
    }

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
    const canvas = document.getElementById('cursorCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function drawLight() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createRadialGradient(
            mouseX, mouseY, 10,
            mouseX, mouseY, 300
        );

        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        requestAnimationFrame(drawLight);
    }

    drawLight();
});