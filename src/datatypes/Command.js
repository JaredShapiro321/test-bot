const DatabaseObject = require('./DatabaseObject');

module.exports = class Command extends DatabaseObject {
	constructor (id, name, guild, roles) {
		super(id);
		this.name = name;
		this.guild = guild;
		this.roles = roles;
	}
}
