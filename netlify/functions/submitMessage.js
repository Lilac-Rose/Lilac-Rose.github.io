const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    const { message, from } = JSON.parse(event.body);

    if (!message || !from) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing message or from field' }),
        };
    }

    try {
        const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
        const result = await client.query(
            q.Create(q.Collection('messages'), {
                data: { message, from },
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
