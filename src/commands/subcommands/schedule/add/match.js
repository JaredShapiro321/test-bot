const { teamReq, dayReq, titleReq, opponentReq, startTimeReq, endTime, length, notes } = require('../../../options');

module.exports = subcommand => subcommand.setName('match')
					.setDescription('Add a match vs. an opponent to the schedule.')
					.addRoleOption(teamReq)
					.addIntegerOption(dayReq)
					.addStringOption(titleReq)
					.addStringOption(opponentReq)
					.addStringOption(startTimeReq)
					.addStringOption(endTime)
					.addStringOption(length)
					.addStringOption(notes)