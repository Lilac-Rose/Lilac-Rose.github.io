exports.handler = async function(event, context) {
    const submittedPassword = event.queryStringParameters.password;

    // Get the Netlify environment variable (password)
    const correctPassword = process.env.PASSWORD_1;

    if (submittedPassword === correctPassword) {
        // If passwords match, return a success response
        return {
            statusCode: 200,
            body: JSON.stringify({ accessGranted: true })
        };
    } else {
        // If passwords do not match, return an error response
        return {
            statusCode: 401,
            body: JSON.stringify({ accessGranted: false, message: 'Access denied' })
        };
    }
};
