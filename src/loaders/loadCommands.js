const fs = require('fs');
const { Collection } = require('discord.js');
const { setPermissions } = require('../services/CommandService.js');

module.exports = async (client, guildId, log) => {
	client.commands = new Collection();

    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);

        // Set a new item in the Collection
        // With the key as the command name and the value as the exported module

        client.commands.set(command.data.name, command);
    }
}