const DatabaseObject = require('./DatabaseObject');

module.exports = class Config extends DatabaseObject {
	constructor (id, guild, roles, commands) {
		super(id);
		this.guild = guild;
		this.roles = roles;
		this.commands = commands;
	}

	generate(client) {
		const generate = require('../methods/config/generate.js');
		return generate(client, this.guild);
	}
}
