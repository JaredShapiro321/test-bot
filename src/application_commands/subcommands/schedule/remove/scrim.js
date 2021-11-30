const { roleReq, dayReq, title, startTime, opponentReq } = require('../../../options');

module.exports = subcommand => subcommand.setName('scrim')
					.setDescription('Remove a scrim vs. an opponent from the schedule.')
					.addRoleOption(roleReq)
					.addIntegerOption(dayReq)
					.addStringOption(opponentReq)
					.addStringOption(title)
					.addStringOption(startTime)