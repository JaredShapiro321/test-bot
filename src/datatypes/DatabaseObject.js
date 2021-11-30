
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
		const model = this.getModel();
		return model.schema;
	}

	getModel() {
		return require(`../models/${this.constructor.name}.js`);
	}

}
