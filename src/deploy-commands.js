require('dotenv').config({path: '../.env'});
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const clientId = process.env.CLIENTID;
const guildId = process.env.GUILDID;
const token = process.env.TOKEN;
const filterIndex = require('./utils/filterIndex.js')
const commandFileDirectory = './application_commands/commands/'

const commands = [];
const commandFiles = fs.readdirSync(commandFileDirectory).filter(file => filterIndex(file));

for (const file of commandFiles) {
	const command = require(`${commandFileDirectory}${file}`);

	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);