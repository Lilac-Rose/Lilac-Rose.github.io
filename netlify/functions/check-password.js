exports.handler = async function(event, context) {
    const submittedPassword = event.queryStringParameters.password;

    // Get the Netlify environment variables (passwords)
    const correctPassword = process.env.PASSWORD_1;  // First password
    const furconPassword = process.env.PASSWORD_2;   // Second password

    if (submittedPassword === correctPassword) {
        // Redirect to ACCESS_GRANTED page if the first password is correct
        return {
            statusCode: 200,
            body: JSON.stringify({ accessGranted: true, redirectTo: 'accessGranted' })
        };
    } else if (submittedPassword === furconPassword) {
        // Redirect to FURPOC message if the second password is correct
        return {
            statusCode: 200,
            body: JSON.stringify({ accessGranted: true, redirectTo: 'furPoc' })
        };
    } else {
        // If passwords do not match, return an error response
        return {
            statusCode: 401,
            body: JSON.stringify({ accessGranted: false, message: 'Access denied' })
        };
    }
};
