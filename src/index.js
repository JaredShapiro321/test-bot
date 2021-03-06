require('dotenv').config({path: '../.env'});
const { Client, Intents } = require('discord.js');
const token = process.env.TOKEN;
const guildId = process.env.GUILDID;
const { loadConfig, loadCommands, loadEvents } = require('./loaders/');

// TODO: Create a google calendar link to add schedule items. [button interaction?]
// TODO: Create databaseObjects for roles, commands, calendarEvents (basically for every collection)


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

// When the client is ready, run this code (only once)
client.once('ready', async () => {
    await load(client, guildId);
});

// Login to Discord with your client's token
client.login(token);

async function load(client, guildId) {
    await loadConfig(client, guildId, true, true);
    await loadCommands(client, guildId, true);
    await loadEvents(client);
    console.log('Ready!');
}