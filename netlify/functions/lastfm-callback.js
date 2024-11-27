const crypto = require('crypto');

exports.handler = async (event) => {
  const apiKey = process.env.LAST_FM_API_KEY;
  const apiSecret = process.env.LAST_FM_API_SECRET;
  const username = "LilacAriaRose";

  try {
    const signature = generateSignature(apiKey, username, apiSecret);
    
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1&api_sig=${signature}`, {
      method: 'GET'
    });

    const data = await response.json();
    
    // Extract the most recent track
    const track = data.recenttracks?.track?.[0];
    
    if (!track) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No recent tracks found' })
      };
    }

    // Extract relevant track information
    const currentTrack = {
      name: track.name,
      artist: track['artist']['#text'],
      album: track.album['#text'],
      image: track.image[2]['#text'], // Medium-sized image
      nowPlaying: track['@attr']?.nowplaying === 'true'
    };

    return {
      statusCode: 200,
      body: JSON.stringify(currentTrack)
    };
  } catch (error) {
    console.error('Error fetching Last.fm track:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error fetching current track', 
        error: error.message 
      })
    };
  }
};

// Generate API signature for Last.fm
function generateSignature(apiKey, username, apiSecret) {
  const baseString = `api_key${apiKey}method=user.getrecenttracks${apiSecret}user${username}`;
  return crypto
    .createHash('md5')
    .update(baseString)
    .digest('hex');
}