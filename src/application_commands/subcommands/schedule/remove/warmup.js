const { teamReq, dayReq, title, startTimeReq, opponent } = require('../../../options');

module.exports = subcommand => subcommand.setName('warm-up')
					.setDescription('Remove a warm up from the schedule.')
					.addRoleOption(teamReq)
					.addIntegerOption(dayReq)
					.addStringOption(startTimeReq)
					.addStringOption(opponent)
					.addStringOption(title)