
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

	define (sequelize) {
		const model = this.getModel();
		return sequelize.define(model.type, model.schema);
	}

	model (sequelize) {
		const { Model } = require('sequelize');
		const model = this.getModel();
		class DatabaseObjectModel extends Model {
			constructor() {
				this.init = super.init(model.schema, {
					sequelize, 
					modelName: model.type 
				});
			}
		};

		return DatabaseObjectModel;
	}

}
