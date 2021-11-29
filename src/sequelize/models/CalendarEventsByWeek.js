const { DataTypes } = require('sequelize');

module.exports = {
	type: 'CalendarEventsByWeek',
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
		calendarWeek: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}
}