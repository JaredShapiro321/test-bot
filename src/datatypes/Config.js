const DatabaseObject = require('./DatabaseObject');

module.exports = class Config extends DatabaseObject {
	constructor (id, roles, commands) {
		super(id);
		this.roles = roles;
		this.commands = commands;
	}
}
