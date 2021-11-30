const { roleReq, dayReq, opponentReq, title, startTime } = require('../../../options');

module.exports = subcommand => subcommand.setName('match')
					.setDescription('Remove a match vs. an opponent from the schedule.')
					.addRoleOption(roleReq)
					.addIntegerOption(dayReq)
					.addStringOption(opponentReq)
					.addStringOption(title)
					.addStringOption(startTime)