require('dotenv').config({path: '../.env'});
const fs = require('fs');
const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const { Client, Collection, Intents } = require('discord.js');
const sequelize = new Sequelize('sqlite:../database/test-bot.db');
const token = process.env.TOKEN;
const guildId = process.env.GUILDID;
const loadConfig = require('./loaders/loadConfig.js');
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

// Setup client commands
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module

    client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', async () => {
    // Setup server based command permissions.
    client.config = await loadConfig(client, guildId, true);

    console.log('Ready!');
});

// Login to Discord with your client's token
client.login(token);
