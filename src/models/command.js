const { DataTypes } = require('sequelize');

module.exports = {
	type: 'Command',
	schema: {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		roles: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}
}