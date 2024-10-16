const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
        const USER_ID = '252130669919076352'; // Your Discord user ID
        const GUILD_ID = process.env.GUILD_ID; // Use environment variable for Guild ID

        // Fetch user data
        const userResponse = await axios.get(`https://discord.com/api/v10/users/${USER_ID}`, {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`
            }
        });

        const userData = userResponse.data;

        // Fetch presence data
        const presenceResponse = await axios.get(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${USER_ID}`, {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`
            }
        });

        // Log presence response data
        console.log("Presence response data:", presenceResponse.data);

        const member = presenceResponse.data; // This contains the member's info
        const activities = member.activities || []; // Default to an empty array if undefined
        
        // Check if there are any activities and retrieve the custom status
        const customStatus = activities.length > 0 && activities[0].type === 4 
            ? activities[0].name 
            : "No custom status"; // Fallback for custom status

        return {
            statusCode: 200,
            body: JSON.stringify({
                username: userData.username,
                avatar: `https://cdn.discordapp.com/avatars/${USER_ID}/${userData.avatar}.png`,
                banner: userData.banner ? `https://cdn.discordapp.com/banners/${USER_ID}/${userData.banner}?size=2048` : null,
                customStatus: customStatus
            })
        };
    } catch (error) {
        console.error('Error fetching Discord profile:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch Discord profile', details: error.message })
        };
    }
};
