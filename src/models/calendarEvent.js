const { DataTypes } = require('sequelize');

module.exports = {
	type: 'CalendarEvent',
	schema: {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		team: {
			type: DataTypes.STRING,
			allowNull: false
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		startTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		endTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		opponent: {
			type: DataTypes.STRING,
			allowNull: true
		},
		notes: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}
}