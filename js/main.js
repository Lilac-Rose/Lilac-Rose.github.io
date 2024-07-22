window.onload = function() {
    console.log('hello world!');
    
    var quotes = [
        "Whole worlds pivot on acts of imagination. - Thirteenth Doctor",
        "Letting it get to you. You know what that’s called? Being alive. Best thing there is. Being alive right now is all that counts. - Eleventh Doctor",
        "There’s no point in being grown up if you can’t be childish sometimes. - Fourth Doctor",
        "Human progress isn’t measured by industry. It’s measured by the value you place on a life. An unimportant life. A life without privilege. The boy who died on the river, that boy's value is your value. That's what defines an age. That's what defines a species. - Twelfth Doctor",
        "I'm not running away from things. I'm running to them before they flare and fade forever. That's all right. Our lives would never remain the same. They can't. One day, soon, maybe, you'll stop. I've known you for a while. - Eleventh Doctor",
        "Some people live more in 20 years than others do in 80. It’s not the time that matters, it’s the person. - Tenth Doctor",
        "The way I see it, every life is a pile of good things and bad things. The good things don’t always soften the bad things, but vice versa, the bad things don’t always spoil the good things or make them unimportant. - Eleventh Doctor"
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
};