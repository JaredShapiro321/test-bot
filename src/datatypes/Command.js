const DatabaseObject = require('./DatabaseObject');

module.exports = class Command extends DatabaseObject {
	constructor (id, name, roles) {
		super(id);
		this.name = name;
		this.roles = roles;
	}
}
