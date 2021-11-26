module.exports = class DatabaseObject {
	constructor (id) {
		this.id = id;
	}

	set type(value) {
		this.type = value;
	}

	get type() {
		return this.constructor.name;
	}

	set schema(value) {
		this.schema = value;
	}

	get schema() {
		const data = this.getData();
		return data.schema;
	}

	getData() {
		return require(`../models/${this.constructor.name}.js`);
	}

	define (sequelize, DataTypes) {
		const data = this.getData();
		return sequelize.define(data.name, data.schema);
	}

}
