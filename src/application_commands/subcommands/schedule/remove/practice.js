const { roleReq, dayReq, title, startTime, opponent } = require('../../../options');

module.exports = subcommand => subcommand.setName('practice')
					.setDescription('Remove a practice from the schedule.')
					.addRoleOption(roleReq)
					.addIntegerOption(dayReq)
					.addStringOption(title)
					.addStringOption(opponent)
					.addStringOption(startTime)