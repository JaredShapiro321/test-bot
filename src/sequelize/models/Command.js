const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('Command', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		roles: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
};