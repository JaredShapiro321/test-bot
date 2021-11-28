const Config = require('../datatypes/Config.js');
const Guild = require('../datatypes/Guild.js');
const Role = require('../datatypes/Role.js');
const Command = require('../datatypes/Command.js');
const { Collection } = require('discord.js');
const fs = require('fs');

module.exports = {
    async bindEvents(client) {
    	try {
    		const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

			for (const file of eventFiles) {
				if (file !== 'index.js') {
				    const eventName = file.split(".")[0];
				    const event = require(`../events/${file}`);
				    client.on(eventName, event.bind(null, client));
				}
			}

			return true;
    	} catch (error) {
    		console.log(error);
    		return false;
    	}
	}
}