const DatabaseObject = require('./DatabaseObject');

module.exports = class CalendarWeek extends DatabaseObject {
	constructor (id, role, startDate, endDate, message) {
		super(id);
		this.role = role;
		this.startDate = startDate;
		this.endDate = endDate;
		this.message = message;
	}
}