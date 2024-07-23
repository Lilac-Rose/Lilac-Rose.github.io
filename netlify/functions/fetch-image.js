import fetch from 'node-fetch';

export async function handler(event, context) {
    const apiKey = process.env.NASA_API_KEY; // Ensure this environment variable is set in Netlify
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error fetching data'
        };
    }
}
