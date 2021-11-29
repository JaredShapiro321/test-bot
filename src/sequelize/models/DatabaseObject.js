const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('DatabaseObject', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false
		}
	});
};
