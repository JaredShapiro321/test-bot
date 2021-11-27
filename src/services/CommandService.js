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

        //console.log(commands);

        commands.forEach((command) => {
            console.log(client.config.commands);

            for (role in client.config.commands.get(command.name).roles) {
                console.log(role)

                const permissions = [
                    {
                        id: client.config.roles.get(role.id),
                        type: 'ROLE',
                        permission: true,
                    },
                ];

                command.permissions.add({ permissions });

                //console.log(command);
            }
        })
	}
}