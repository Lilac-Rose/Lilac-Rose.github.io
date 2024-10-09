document.addEventListener('DOMContentLoaded', function() {
    console.log('hello world!');

    // Quotes Logic
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

    // Project Cards Animation
    const projectCards = document.querySelectorAll('.project-card');
    const projectsContainer = document.getElementById('projectsContainer');
    if (projectsContainer) {
        projectsContainer.style.display = 'block';
    }
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.backgroundColor = '#1a1a1a';
        });
        card.addEventListener('mouseleave', () => {
            card.style.backgroundColor = '#1a1a1a';
        });
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Access Code Functionality
    const accessCodeInput = document.getElementById('accessCodeInput');
    const submitAccessCode = document.getElementById('submitAccessCode');
    const accessCodeMessage = document.getElementById('accessCodeMessage');

    // Store the original input value
    let originalValue = ''; // Store the original value of input

    if (submitAccessCode) {
        submitAccessCode.addEventListener('click', async function() {
            // Use the originalValue for submission
            const enteredCode = originalValue.trim(); // Get the original input value

            // Call the Netlify function to verify the access code
            try {
                const response = await fetch(`/.netlify/functions/check-password?password=${encodeURIComponent(enteredCode)}`);
                const data = await response.json();

                if (data.accessGranted) {
                    // Redirect to ACCESS_GRANTED page if the password is correct
                    window.location.href = 'VERFALL/ACCESS_GRANTED.html';
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
    }

    // Change input type to text on focus
    accessCodeInput.addEventListener('focus', () => {
        accessCodeInput.type = 'text'; // Show as text to avoid autofill
    });

    // Change input type to password on blur
    accessCodeInput.addEventListener('blur', () => {
        accessCodeInput.type = 'password'; // Hide input
    });

    // Update the original value and display asterisks
    accessCodeInput.addEventListener('input', () => {
        originalValue = accessCodeInput.value; // Store the current value
        // Update input to show asterisks
        accessCodeInput.value = '*'.repeat(originalValue.length); // Display asterisks for the length of the original input
    });
});
