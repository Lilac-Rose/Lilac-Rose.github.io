const { google } = require('googleapis');
const axios = require('axios');

// Configure OAuth 2.0 client
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI // Your redirect URI in Netlify
);

exports.handler = async (event, context) => {
  // Check for access token in query parameters
  const accessToken = event.queryStringParameters.access_token;
  
  if (!accessToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        message: 'No access token provided',
        authorizationUrl: getAuthorizationUrl()
      })
    };
  }

  try {
    // Set the access token for the OAuth client
    oauth2Client.setCredentials({ access_token: accessToken });

    // Initialize YouTube service
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    });

    // Fetch user's recently played tracks
    const response = await youtube.activities.list({
      part: 'snippet,contentDetails',
      home: true,
      maxResults: 10,
      mine: true
    });

    // Process and return listening history
    const listeningHistory = response.data.items
      .filter(item => 
        item.snippet.type === 'playlistItem' || 
        item.snippet.type === 'upload'
      )
      .map(item => ({
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
        videoId: item.contentDetails.playlistItem?.resourceId?.videoId || 
                 item.contentDetails.upload?.videoId
      }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(listeningHistory)
    };
  } catch (error) {
    console.error('Error fetching YouTube Music history:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error fetching listening history',
        error: error.message,
        authorizationUrl: getAuthorizationUrl()
      })
    };
  }
};

// Generate authorization URL
function getAuthorizationUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
}

// Separate function for token exchange
exports.exchangeToken = async (event, context) => {
  const code = event.queryStringParameters.code;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No authorization code provided' })
    };
  }

  try {
    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
      })
    };
  } catch (error) {
    console.error('Token exchange error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Failed to exchange token',
        error: error.message 
      })
    };
  }
};