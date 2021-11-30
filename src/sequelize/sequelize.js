const { Sequelize } = require('sequelize');
const { applyAssociations } = require('./associations.js');

module.exports = {
	async setupSequelize(models) {
		const sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: process.env.DATABASEURL,
			logQueryParameters: true,
			benchmark: true
		});

		// Define all models
		for (const model of models) {
			const defineModel = require(`./models/${model}`)
			defineModel(sequelize);
		}

		for (const model of models) {
			applyAssociations(sequelize, model);
		}

		try {
		  await sequelize.authenticate();
		  console.log('Connection to database has been established successfully.');
		} catch (error) {
		  console.error('Unable to connect to the database:');
		}

		return sequelize;
	}
}