const DatabaseObject = require('./DatabaseObject');


//TODO: new this.length property with default of 30 mins. 
//TODO: create new types for matches, events, etc and split it up a lil bit..
module.exports = class CalendarEvent extends DatabaseObject {
	constructor(id, eventType, calendarWeek, role, date, startTime, endTime, title, opponent, notes) {
		super(id);
		this.eventType = eventType;
		this.calendarWeek = calendarWeek;
		this.role = role;
		this.date = date;
		this.startTime = startTime;
		this.endTime = endTime;
		this.title = title;
		this.opponent = opponent;
		this.notes = notes;
	}
}
