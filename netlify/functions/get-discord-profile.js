// functions/get-discord-profile.js

const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
        const USER_ID = '252130669919076352';

        const response = await axios.get(`https://discord.com/api/users/${USER_ID}`, {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`
            }
        });

        const userData = response.data;

        return {
            statusCode: 200,
            body: JSON.stringify({
                username: userData.username,
                discriminator: userData.discriminator,
                avatar: `https://cdn.discordapp.com/avatars/${USER_ID}/${userData.avatar}.png`,
                banner: userData.banner ? `https://cdn.discordapp.com/banners/${USER_ID}/${userData.banner}.png` : null,
                status: userData.status || 'offline' // You might need to use Discord Gateway for real-time status
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch Discord profile' })
        };
    }
};