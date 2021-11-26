const Config = require('../datatypes/Config.js');
const Guild = require('../datatypes/Guild.js');
const Role = require('../datatypes/Role.js');
const Command = require('../datatypes/Command.js');
const { Collection } = require('discord.js');
const fs = require('fs');

module.exports = {
	readFromFile (path) {
		let config = undefined;

		try {
		    fs.accessSync(path, fs.constants.F_OK);

		    console.log(`Config file found at path: ${path}`);
			
			const data = fs.readFileSync(path);

			config = JSON.parse(data);

		} catch (err) {
			console.error(err);
		}

		return config;
	},
	writeToFile (path, client, config, force) {
	    try {
	    	fs.accessSync(path, fs.constants.F_OK);

	    	const data = fs.readFileSync(path);

	    	console.log(`Config file found at path: ${path}`);

	    	if (fileData.length !== 0) {
                console.log(`Config file found at path: ${path}`);
                return;
            } else {
                console.log(`Config file at path: ${path} is empty.\nRegenerating...`);
            } 

            const config = JSON.stringify(toJSON(client.config), null, 4);
	        fs.writeFileSync(path, config);
	    } catch (err) {
	    	console.log(err);
	    }   
	},
	async generateFromGuild (client, guild) {
	    if (typeof guild === 'string') {
	    	const guilds = await client.guilds.fetch();
	        guild = await guilds.get(guild).fetch();
	    }

	   	const roles = await guild.roles.fetch();

	    // Create serverConfig
	    let config = new Config('0', guild.id, {}, {});
	    
	    // Setup guild
	    let guildConfig = new Guild(guild.id, guild.name);
	    config.guild[guild.name] = guildConfig;
	    

	    // Setup roles config
	    let rolesConfig = new Collection();
	    roles.forEach((role) => {
	        rolesConfig.set(role.id, new Role(role.id, role.name, guild.id));
	    });

	    config.roles = rolesConfig;

	    
	    // Setup commands config
	    let commandsConfig = new Collection();
	    let commandId = 0;
	    client.commands.forEach(command => {
	        commandsConfig.set(command.data.name, new Command(commandId++, command.data.name, []));
	    });

	    config.commands = commandsConfig;

	    return config;
	}
}