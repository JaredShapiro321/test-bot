const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('Config', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
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
	});
	sequelize.models.Config.hasMany(Role, {
	    foreignKey: 'config',
	    constraints: false,
	    scope: {
	    	commentableType: 'image'
	  	}
	});
};