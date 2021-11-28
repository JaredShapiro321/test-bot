const DatabaseObject = require('./DatabaseObject');

module.exports = class Config extends DatabaseObject {
	constructor (id, roles, commands) {
		super(id);
		this.roles = roles;
		this.commands = commands;
	}

	generate(client) {
		const generate = require('../methods/config/generate.js');
		return generate(client, this.guild);
	}
}
