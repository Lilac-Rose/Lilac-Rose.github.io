// lastfm-callback.js
exports.handler = async (event) => {
  const code = event.queryStringParameters.code;
  const apiKey = process.env.LAST_FM_API_KEY;
  const apiSecret = process.env.LAST_FM_API_SECRET;
  const token = await exchangeCodeForToken(code, apiKey, apiSecret);
  // Use the token to make API requests to Last.fm
};

async function exchangeCodeForToken(code, apiKey, apiSecret) {
  const response = await fetch(`https://www.last.fm/api/auth/getToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `code=${code}&api_key=${apiKey}&api_secret=${apiSecret}`,
  });
  const data = await response.json();
  return data.token;
}