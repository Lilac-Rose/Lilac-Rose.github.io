function checkKeys() {
    const key1 = document.getElementById('key1').value.trim();
    const key2 = document.getElementById('key2').value.trim();
    const key3 = document.getElementById('key3').value.trim();
    const key4 = document.getElementById('key4').value.trim();

    const correctKeys = ['key1Value', 'key2Value', 'key3Value', 'key4Value'];

    if (key1 === correctKeys[0] && key2 === correctKeys[1] && key3 === correctKeys[2] && key4 === correctKeys[3]) {
        document.getElementById('feedback-message').innerText = 'Success! All keys are correct.';
    } else {
        document.getElementById('feedback-message').innerText = 'Incorrect keys. Please try again.';
    }
}
