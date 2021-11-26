const { DataTypes } = require('sequelize');

module.exports = {
	type: 'Role',
	schema: {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}
}