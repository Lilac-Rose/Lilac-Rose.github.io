const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');
const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

async function getAccessToken() {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: "refresh_token"
    });
    return response.data.access_token;
}

app.get('/.netlify/functions/youtube-music-status', async (req, res) =>{
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get('https://youtube.googleapis.com/youtube/v3/videos', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                part: 'snippet,contentDetails',
                myRating: 'like',
                maxResults: 1
            }
        });

        const currentTrack = response.data.items[0] || null;

        if(!currentTrack) {
            return res.json({isPlaying : false});
        }

        const duration = parseDuration(currentTrack.contentDetails.duration);
        const currentTime = estimateCurrentTime(currentTrack.snippet.publishedAt);

        res.json({
            isPlaying: true,
            track: {
                title: currentTrack.snippet.title,
                arists: currentTrack.snippet.channelTitle,
                thumbnail: currentTrack.snippet.thumbnails.default.url,
                duration: duration,
                currentTime: currentTime
            }
        });
    } catch (error) {
        console.error('Error fetching Youtube Music status:', error);
        res.status(500).json({error: "Failed to fetch current track"});
    }
});

function parseDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = (match[1] || '').replace('H', '') || 0;
    const minutes = (match[2] || '').replace('M', '') || 0;
    const seconds = (match[3] || '').replace('S', '') || 0;

    return(parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds);
}

function estimateCurrentTime(startTime) {
    const start = new DataTransfer(startTime).getTime();
    const now = Date.now();
    const elapsed = (now - start) / 1000;
    return elapsed;
}

module.exports.handler = serverless(app);