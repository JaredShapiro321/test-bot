require('dotenv').config({path: '../.env'});
const fs = require('fs');
const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const { Client, Collection, Intents } = require('discord.js');
const sequelize = new Sequelize('sqlite:../database/test-bot.db');
const token = process.env.TOKEN;
const guildId = process.env.GUILDID;
const loadConfig = require('./loaders/loadConfig.js');
const loadCommands = require('./loaders/loadCommands.js');
const DatabaseObject = require('./DataTypes/DatabaseObject.js')

const databaseObject = new(DatabaseObject);
const ConfigService = require('./services/ConfigService.js');


// TODO: Create a google calendar link to add schedule items. [button interaction?]

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

// Setup client events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
}

// When the client is ready, run this code (only once)
client.once('ready', async () => {
    await load(client, guildId);
});

// Login to Discord with your client's token
client.login(token);

async function load(client, guildId) {
    await loadConfig(client, guildId, false, true);
    await loadCommands(client, guildId, true);
    console.log('Ready!');
}