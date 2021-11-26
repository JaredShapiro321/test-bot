const DatabaseObject = require('./DatabaseObject');

module.exports = class CalendarWeek extends DatabaseObject {
	constructor (id, team, startDate, endDate, message) {
		super(id);
		this.team = team;
		this.startDate = startDate;
		this.endDate = endDate;
		this.message = message;
	}
}