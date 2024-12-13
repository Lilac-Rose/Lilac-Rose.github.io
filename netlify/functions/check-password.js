exports.handler = async function(event, context) {
    const submittedPassword = event.queryStringParameters.password;

    const correctPassword = process.env.PASSWORD_1;
    const furconPassword = process.env.PASSWORD_2;

    if (submittedPassword === correctPassword) {
        return {
            statusCode: 200,
            body: JSON.stringify({ accessGranted: true, redirectTo: 'accessGranted' })
        };
    } else if (submittedPassword === furconPassword) {
        return {
            statusCode: 200,
            body: JSON.stringify({ accessGranted: true, redirectTo: 'furPoc' })
        };
    } else {
        return {
            statusCode: 401,
            body: JSON.stringify({ accessGranted: false, message: 'Access denied' })
        };
    }
};
