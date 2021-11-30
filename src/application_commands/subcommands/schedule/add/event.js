const { roleReq, dayReq, titleReq, startTimeReq, endTime, length, notes } = require('../../../options');

module.exports = subcommand => subcommand.setName('event')
					.setDescription('Add a new event to the schedule.')
					.addRoleOption(roleReq)
					.addIntegerOption(dayReq)
					.addStringOption(titleReq)
					.addStringOption(startTimeReq)
					.addStringOption(endTime)
					.addStringOption(length)
					.addStringOption(notes)