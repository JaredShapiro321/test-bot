const DatabaseObject = require('./DatabaseObject');

module.exports = class CalendarEvent extends DatabaseObject {
	constructor(team, calendarWeek, date, type, startTime, endTime, title, opponent, notes) {
		super(id);
		this.team = team;
		this.calendarWeek = calendarWeek;
		this.date = date;
		this.type = type;
		this.startTime = startTime;
		this.endTime = endTime;
		this.title = title;
		this.opponent = opponent;
		this.notes = notes;
	}
}
