window.onload = function() {
    console.log('hello world!');
    
    var quotes = [
        "Whole worlds pivot on acts of imagination. - Thirteenth Doctor",
        "Letting it get to you. You know what that’s called? Being alive. Best thing there is. Being alive right now is all that counts. - Eleventh Doctor"
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