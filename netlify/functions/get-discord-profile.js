const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
    intents: [ 
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildPresences 
    ] 
});

exports.handler = async function(event, context) {
    try {
        const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
        const USER_ID = '252130669919076352'; // Your Discord user ID
        const GUILD_ID = process.env.GUILD_ID; // Use environment variable for Guild ID

        await client.login(DISCORD_BOT_TOKEN);

        const guild = await client.guilds.fetch(GUILD_ID);
        const member = await guild.members.fetch(USER_ID);

        const userData = member.user;
        const customStatus = member.presence?.activities.find(activity => activity.type === 4)?.name || "No custom status";

        return {
            statusCode: 200,
            body: JSON.stringify({
                username: userData.username,
                avatar: userData.displayAvatarURL({ dynamic: true }),
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
    } finally {
        client.destroy();
    }
};