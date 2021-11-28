const Config = require('../datatypes/Config.js');
const Guild = require('../datatypes/Guild.js');
const Role = require('../datatypes/Role.js');
const Command = require('../datatypes/Command.js');
const { Collection } = require('discord.js');
const fs = require('fs');

module.exports = {
    async generateFromFiles() {
        const commands = new Collection();

        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);

            // Set a new item in the Collection
            // With the key as the command name and the value as the exported module

            commands.set(command.data.name, command);
        }

        return commands;
    },
	async setPermissions (client, guildId) {
		const commands = await client.guilds.cache.get(guildId)?.commands.fetch();
        
        commands.forEach((command) => {
            const roles = client.config.commands.get(command.name).roles;
        
            for (i in roles) {
                const permissions = [
                    {
                        id: client.config.roles.get(roles[i]).id,
                        type: 'ROLE',
                        permission: true,
                    },
                ];

                command.permissions.add({ permissions });
            }
        })
	}
}