const { Collection } = require('discord.js');
const { Config } = require('../datatypes');
const { roles, commands } = require('./');

module.exports = {
	fromJSON (config) {
		return new Config(config.id, roles.fromJSON(config.roles), commands.fromJSON(config.commands));
	},
	toJSON (config) {
		return new Config(config.id, roles.toJSON(config.roles), commands.toJSON(config.commands));
	},
	isValid (config) {
		const configProperties = Object.getOwnPropertyNames(config);
		const defaultProperties = Object.getOwnPropertyNames(new Config());

		for (i in defaultProperties) {
			const property = defaultProperties[i];
			const { isValid } = require(`./${property}.js`);

			if (property !== configProperties[i]) {
				return false;
			}

			if (!isValid(config[property])) {
				return false;
			}
		}

		return true;
	}
}