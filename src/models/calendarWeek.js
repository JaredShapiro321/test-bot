const { DataTypes } = require('sequelize');

//TODO: Create a calendarEvent id spot to store a reference to that instead of the whole calendareventsbyweek thing.

module.exports = {
	type: 'CalendarWeek',
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
		startDate: {
			type: DataTypes.DATE,
			allowNull: false
		},
		endDate: {
			type: DataTypes.DATE,
			allowNull: false
		},
		messageId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		calendarEvent: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}
}