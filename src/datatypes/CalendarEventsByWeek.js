const DatabaseObject = require('./DatabaseObject');

module.exports = class CalendarEventsByWeek extends DatabaseObject {
	constructor (id, team, calendarWeek) {
		super(id);
		this.team = team;
		this.calendarWeek = calendarWeek;
	}
}
