const { DataTypes } = require('sequelize');

module.exports = {
	type: 'DatabaseObject',
	schema: {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		}
	}
}