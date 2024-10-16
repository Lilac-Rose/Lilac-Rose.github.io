document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

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

    const quotesElement = document.getElementById('quotes');

    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    function setRandomQuote() {
        if (quotesElement) {
            quotesElement.innerHTML = getRandomQuote();
        }
    }

    setRandomQuote();

    quotesElement?.addEventListener('click', setRandomQuote);

    // Project cards functionality
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.2s';
            card.style.transform = 'scale(1.1)'; // Enlarge on hover
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)'; // Reset size on leave
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate tilt angle
            const tiltX = (y / rect.height - 0.5) * 20; // Max tilt of 20 degrees
            const tiltY = -(x / rect.width - 0.5) * 20; // Max tilt of 20 degrees
            card.style.transform = `scale(1.1) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
    });

    // Access code functionality
    const accessCodeInput = document.getElementById('accessCodeInput');
    const submitAccessCode = document.getElementById('submitAccessCode');
    const accessCodeMessage = document.getElementById('accessCodeMessage');

    submitAccessCode?.addEventListener('click', async function() {
        try {
            const enteredCode = accessCodeInput.value.trim();
            const response = await fetch(`/.netlify/functions/check-password?password=${encodeURIComponent(enteredCode)}`);
            const data = await response.json();

            if (data.accessGranted) {
                window.location.href = data.redirectTo === 'accessGranted' ? 'VERFALL/ACCESS_GRANTED.html' : 'FURPOC/message.html';
            } else {
                accessCodeMessage.textContent = 'Invalid access code. Please try again.';
                accessCodeMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            accessCodeMessage.textContent = 'An error occurred. Please try again later.';
            accessCodeMessage.style.color = 'red';
        }
    });

    // Fetch Discord profile
    fetch('/.netlify/functions/get-discord-profile')
    .then((response) => response.json())
    .then((data) => {
        console.log('Parsed data from API:', data);

        const avatarElement = document.getElementById('discordAvatar');
        const usernameElement = document.getElementById('discordUsername');
        const statusElement = document.getElementById('discordStatus');
        const bannerElement = document.getElementById('discordBanner');
        const customStatusElement = document.getElementById('customStatus');
        const customEmoteElement = document.getElementById('customEmote');

        avatarElement.src = `${data.avatar}`;
        usernameElement.textContent = data.username;
        bannerElement.style.backgroundImage = `url(${data.banner})`;

        // Update custom status and emote
        const customEmoteHtml = `${data.customEmote ? `<img src="${data.customEmote.url}" width="24" height="24" style="margin-right: 8px; vertical-align: middle;">` : ''}${data.customStatus}`;
        statusElement.innerHTML = customEmoteHtml;

        // Remove unnecessary elements
        customStatusElement.remove();
        customEmoteElement.remove();
    })
    .catch((error) => console.error('Error fetching Discord profile:', error));
});
