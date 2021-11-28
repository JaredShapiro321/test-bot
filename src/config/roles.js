const { Collection } = require('discord.js');
const { Role } = require('../datatypes');

module.exports = {
	fromJSON (roles) {
		let result = new Collection();
		for (name in roles) {
			const role = roles[name];
			result.set(name, new Role(role.id, role.name, role.guild));
		}

		return result;
	},
	toJSON (roles) {
		let result = {}; 
		roles.forEach((role, name) => {
			result[name] = role;
		});

		return result;
	},
	isValid (roles) {
		for (name in roles) {
			const role = roles[name];
		}

		return true;
	}
}