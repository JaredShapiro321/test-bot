const { DataTypes } = require('sequelize');

//TODO: Create a calendarEvent id spot to store a reference to that instead of the whole calendareventsbyweek thing.

module.exports = (sequelize) => {
	sequelize.define('CalendarWeek', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false
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
		message: {
			type: DataTypes.STRING,
			allowNull: true
		}
	});
};