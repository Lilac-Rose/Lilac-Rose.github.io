document.querySelector("form[name='message']").addEventListener("submit", function(event) {
    event.preventDefault();

    // Here, you can add any additional client-side validation if necessary.
    
    // Send the form data to Netlify Forms
    const form = event.target;
    const data = new FormData(form);

    // Optionally, display a loading message or disable the button
    // form.querySelector("button").disabled = true;

    fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Handle successful submission, e.g., show a thank-you message
            form.reset();
            alert("Thank you for your message!");
        } else {
            // Handle errors, e.g., show an error message
            alert("There was an error submitting your message.");
        }
    })
    .catch(error => {
        // Handle network errors
        alert("There was an error submitting your message: " + error.message);
    });
});