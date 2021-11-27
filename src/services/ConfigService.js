const Config = require('../datatypes/Config.js');
const Guild = require('../datatypes/Guild.js');
const Role = require('../datatypes/Role.js');
const Command = require('../datatypes/Command.js');
const { Collection } = require('discord.js');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { toJSON, fromJSON } = require('../utils')


module.exports = {
	// TODO: Make sure this function isn't super broken.
	readFromFile (path) {
		let config = undefined;

		try {
		    fs.accessSync(path, fs.constants.F_OK);
		    console.log(`Config file found at path: ${path}`);
			
			const data = fs.readFileSync(path);
			config = JSON.parse(data);
		} catch (error) {
			console.error(error);
		}

		return config;
	},
	writeToFile (client, path) {
	    try {
	    	fs.accessSync(path, fs.constants.F_OK);
	    	console.log(`Config file found at path: ${path}`);

            const config = JSON.stringify(toJSON(client.config), null, 4);
	        fs.writeFileSync(path, config);
	    } catch (error) {
	    	console.log(error);
	    }   
	},
	exportToFile (client) {
		const path = '../config.json';
		module.exports.writeToFile(client, path);
	},
	generateFromFile (client) {
		const path = '../config.json';
		const config = module.exports.readFromFile(path);

	    return fromJSON(config);
	},
	async generateFromGuild (client, guildId) {
	    const guild = await client.guilds.fetch().then(async (guilds) => {
	    	const guild = await guilds.get(guildId).fetch();

	    	try {
	    		await guild.roles.fetch();
	   			await guild.commands.fetch();
	    	} catch (error) {
	    		console.log(error);
	    	}

	   		return guild;
	    }).catch(error => console.log(error));

	    // Create serverConfig
	    let config = new Config('0', guildId, {}, {});
	    

	    // Setup guild config
	    let guildConfig = new Guild(guild.id, guild.name);
	    config.guild[guild.name] = guildConfig;
	    

	    // Setup roles config
	    let rolesConfig = new Collection();
	    guild.roles.cache.forEach((role) => {
	        rolesConfig.set(role.id, new Role(role.id, role.name, guild.id));
	    });
	    config.roles = rolesConfig;


	    // Setup commands config
	    let commandsConfig = new Collection();
	    guild.commands.cache.forEach(command => {
	        commandsConfig.set(command.name, new Command(command.id, command.name, []));
	    });
	    config.commands = commandsConfig;


	    return config;
	}
}