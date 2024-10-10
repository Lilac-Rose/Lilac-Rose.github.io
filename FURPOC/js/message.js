document.getElementById('messageForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const messageInput = document.getElementById('messageInput').value.trim();
    const fromInput = document.getElementById('fromInput').value.trim();
    const messageStatus = document.getElementById('messageStatus');

    // Clear previous status
    messageStatus.textContent = '';

    if (!messageInput || !fromInput) {
        messageStatus.textContent = 'Please enter both a message and your name!';
        messageStatus.id = 'error';
        return;
    }

    const messageData = {
        message: messageInput,
        from: fromInput
    };

    try {
        const response = await fetch('/.netlify/functions/submitMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });

        if (response.ok) {
            messageStatus.textContent = 'Thank you for your message!';
            document.getElementById('messageForm').reset();
        } else {
            messageStatus.textContent = 'There was a problem submitting your message. Please try again later.';
        }
    } catch (error) {
        messageStatus.textContent = 'Failed to submit. Please check your connection.';
    }
});
