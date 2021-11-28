const { Collection } = require('discord.js');
const { Command } = require('../datatypes');
module.exports = {
	fromJSON (commands) {
		let result = new Collection();
		for (name in commands) {
			const command = commands[name];
			result.set(name, new Command(command.id, command.name, command.guild, command.roles));
		}

		return result;
	},
	toJSON (commands) {
		let result = {}; 
		commands.forEach((command, name) => {
			result[name] = command;
		});

		return result;
	},
	isValid (commands) {
		for (name in commands) {
			const command = commands[name];
		}

		return true;
	}
}