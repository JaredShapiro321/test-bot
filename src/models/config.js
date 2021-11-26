const { DataTypes } = require('sequelize');

module.exports = {
	type: 'Config',
	schema: {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		guild: {
			type: DataTypes.STRING,
			allowNull: false
		},
		roles: {
			type: DataTypes.STRING,
			allowNull: false
		},
		commands: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}
}