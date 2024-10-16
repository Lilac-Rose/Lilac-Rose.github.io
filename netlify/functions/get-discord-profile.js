const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
        const USER_ID = '252130669919076352'; // Your Discord user ID
        const GUILD_ID = process.env.GUILD_ID;

        const userResponse = await axios.get(`https://discord.com/api/v10/users/${USER_ID}`, {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`
            }
        });

        const userData = userResponse.data;

        const presenceResponse = await axios.get(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${USER_ID}`, {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`
            }
        });

        const activities = presenceResponse.data.activities;
        const customStatus = activities.length > 0 ? activities[0].name : "No custom status";

        return {
            statusCode: 200,
            body: JSON.stringify({
                username: userData.username,
                discriminator: userData.discriminator,
                avatar: `https://cdn.discordapp.com/avatars/${USER_ID}/${userData.avatar}.png`,
                banner: userData.banner ? `https://cdn.discordapp.com/banners/${USER_ID}/${userData.banner}.png` : null,
                customStatus: customStatus
            })
        };
    } catch (error) {
        console.error('Error fetching Discord profile:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch Discord profile' })
        };
    }
};
