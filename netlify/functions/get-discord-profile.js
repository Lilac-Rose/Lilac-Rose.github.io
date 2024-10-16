const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
    intents: [ 
        1, // Guilds
        2, // GuildMembers
        4, // GuildBans
        8, // GuildEmojis
        16, // GuildIntegrations
        32, // GuildWebhooks
        64, // GuildInvites
        128, // GuildVoiceStates
        256, // GuildPresences
        512, // GuildMessages
        1024, // GuildMessageReactions
        2048, // GuildMessageTyping
        4096 // DirectMessages
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

        // Find custom status activity
        const customStatus = member.presence?.activities.find(activity => activity.type === 4);
        const customStatusText = customStatus ? customStatus.state : "No custom status";
        const customEmote = customStatus?.emoji;

        return {
            statusCode: 200,
            body: JSON.stringify({
                username: userData.username,
                avatar: userData.displayAvatarURL({ dynamic: true }),
                banner: userData.banner ? `https://cdn.discordapp.com/banners/${USER_ID}/${userData.banner}?size=2048` : null,
                customStatus: customStatusText,
                customEmote: customEmote
                    ? {
                        id: customEmote.id,
                        name: customEmote.name,
                        animated: customEmote.animated,
                        url: customEmote.id
                            ? `https://cdn.discordapp.com/emojis/${customEmote.id}.${customEmote.animated ? 'gif' : 'webp'}`
                            : customEmote.url
                    }
                    : null
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