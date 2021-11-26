const DatabaseObject = require('./DatabaseObject');

module.exports = class Guild extends DatabaseObject {
	constructor (id, name, roles, sequelize) {
		super(id);
		this.name = name;
		this.roles = roles;
	}
/*
	get roles() {
		if (sequelize !== undefined) this.roles = getRoles(sequelize);
	}

	set roles() {

	}
*/


	//TODO: 
	// Get roles where guild id matches this.id
	getRoles (sequelize) {
		
	}
}
