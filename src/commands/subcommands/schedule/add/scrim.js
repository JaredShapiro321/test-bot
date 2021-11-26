const { teamReq, dayReq, opponentReq, startTimeReq, endTime, length, notes } = require('../../../options');

module.exports = subcommand => subcommand.setName('scrim')
					.setDescription('Add a scrimmage vs. opponent to the schedule.')
					.addRoleOption(teamReq)
					.addIntegerOption(dayReq)
					.addStringOption(opponentReq)
					.addStringOption(startTimeReq)
					.addStringOption(endTime)
					.addStringOption(length)
					.addStringOption(notes);