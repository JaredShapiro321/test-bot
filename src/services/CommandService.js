const Config = require('../datatypes/Config.js');
const Guild = require('../datatypes/Guild.js');
const Role = require('../datatypes/Role.js');
const Command = require('../datatypes/Command.js');
const { Collection } = require('discord.js');
const fs = require('fs');

module.exports = {
	async setPermissions (client, guildId) {
		const command = await client.guilds.cache.get(guildId)?.commands.fetch('876543210987654321');

		for (role in client.config.commands[command.data.name]) {
            console.log(client.config.roles)

            const permissions = [
            {
                id: '1',
                type: 'ROLE',
                permission: false,
            },
        ];

        command.data.permissions.add({ permissions });
        }
	},
}