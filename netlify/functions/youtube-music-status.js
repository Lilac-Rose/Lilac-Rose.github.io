const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');
const app = express();
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Validate environment variables
if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error('Missing required environment variables. Please check your .env file.');
}

async function getAccessToken() {
    try {
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://oauth2.googleapis.com/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: REFRESH_TOKEN,
                grant_type: 'refresh_token'
            })
        });

        if (!tokenResponse.data.access_token) {
            throw new Error('No access token received');
        }

        return tokenResponse.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw new Error(`Failed to fetch access token: ${error.response?.data?.error_description || error.message}`);
    }
}

app.get('/.netlify/functions/youtube-music-status', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        
        const response = await axios({
            method: 'get',
            url: 'https://youtube.googleapis.com/youtube/v3/videos',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            },
            params: {
                part: 'snippet,contentDetails',
                myRating: 'like',
                maxResults: 1
            }
        });

        const currentTrack = response.data.items[0];
        
        if (!currentTrack) {
            return res.json({
                isPlaying: false,
                timestamp: new Date().toISOString()
            });
        }

        const duration = parseDuration(currentTrack.contentDetails.duration);
        const currentTime = estimateCurrentTime(currentTrack.snippet.publishedAt);

        res.json({
            isPlaying: true,
            timestamp: new Date().toISOString(),
            track: {
                title: currentTrack.snippet.title,
                artists: currentTrack.snippet.channelTitle,
                thumbnail: currentTrack.snippet.thumbnails.default.url,
                duration,
                currentTime,
                videoId: currentTrack.id
            }
        });

    } catch (error) {
        console.error('Error in youtube-music-status:', {
            message: error.message,
            response: error.response?.data
        });
        
        res.status(500).json({
            error: "Failed to fetch current track",
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

function parseDuration(duration) {
    if (!duration) return 0;
    
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;
    
    const hours = (match[1] || '').replace('H', '') || 0;
    const minutes = (match[2] || '').replace('M', '') || 0;
    const seconds = (match[3] || '').replace('S', '') || 0;
    
    return (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds);
}

function estimateCurrentTime(startTime) {
    if (!startTime) return 0;
    
    const start = new Date(startTime).getTime();
    const now = Date.now();
    return Math.floor((now - start) / 1000);
}

module.exports.handler = serverless(app);