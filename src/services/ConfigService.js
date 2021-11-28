const Config = require('../datatypes/Config.js');
const Guild = require('../datatypes/Guild.js');
const Role = require('../datatypes/Role.js');
const Command = require('../datatypes/Command.js');
const { Collection } = require('discord.js');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { toJSON, fromJSON } = require('../config/config.js');


module.exports = {
	// TODO: Make sure this function isn't super broken.
	readFromFile (path) {
		let config = undefined;

		try {
		    fs.accessSync(path, fs.constants.F_OK);
		    console.log(`Reading from '${path}'...`);
			
			const data = fs.readFileSync(path);
			config = fromJSON(JSON.parse(data));
		} catch (error) {
			console.error(error);
		}

		return config;
	},
	writeToFile (config, path) {
	    try {
	    	fs.accessSync(path, fs.constants.F_OK);
	    	console.log(`Writing to '${path}'...`);

            const data = JSON.stringify(toJSON(config), null, 4);
	        fs.writeFileSync(path, data);
	    } catch (error) {
	    	console.log(error);
	    }   
	},
	exportToFile (client) {
		const path = '../config.json';
		module.exports.writeToFile(client.config, path);
	},
	generateFromFile (client) {
		const path = '../config.json';
		const config = module.exports.readFromFile(path);

		return config;
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
	    let config = new Config(guild.id, {}, {});
	    

	    // Setup guild config
	    //let guildConfig = guild.id;
	    //let guildConfig = new Guild(guild.id, guild.name);
	    //config.guild[guild.name] = guildConfig;
	    


	    // Setup roles config
	    let rolesConfig = new Collection();
	    guild.roles.cache.forEach((role) => {
	        rolesConfig.set(role.name, new Role(role.id, role.name, guild.id));
	    });
	    config.roles = rolesConfig;


	    // Setup commands config
	    let commandsConfig = new Collection();
	    guild.commands.cache.forEach(command => {
	        commandsConfig.set(command.name, new Command(command.id, command.name, guild.id, []));
	    });
	    config.commands = commandsConfig;


	    return config;
	}
}