const DatabaseObject = require('./DatabaseObject');

module.exports = class Role extends DatabaseObject {
	constructor (id, name, guild) {
		super(id);
		this.name = name;
		this.guild = guild;
	}
}