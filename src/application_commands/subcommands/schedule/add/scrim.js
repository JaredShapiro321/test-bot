const { roleReq, dayReq, opponentReq, startTimeReq, endTime, length, notes } = require('../../../options');

module.exports = subcommand => subcommand.setName('scrim')
					.setDescription('Add a scrimmage vs. opponent to the schedule.')
					.addRoleOption(roleReq)
					.addIntegerOption(dayReq)
					.addStringOption(opponentReq)
					.addStringOption(startTimeReq)
					.addStringOption(endTime)
					.addStringOption(length)
					.addStringOption(notes);