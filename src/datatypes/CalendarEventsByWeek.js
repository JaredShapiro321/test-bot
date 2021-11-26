const DatabaseObject = require('./DatabaseObject');

module.exports = class CalendarEventsByWeek extends DatabaseObject {
	constructor (id, team, event, calendarWeek) {
		super(id);
		this.team = team;
		this.calendarEvent = calendarEvent;
		this.calendarWeek = calendarWeek;
	}
}
