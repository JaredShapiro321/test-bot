const { roleReq, dayReq, title, startTimeReq, opponent } = require('../../../options');

module.exports = subcommand => subcommand.setName('warmup')
					.setDescription('Remove a warm up from the schedule.')
					.addRoleOption(roleReq)
					.addIntegerOption(dayReq)
					.addStringOption(startTimeReq)
					.addStringOption(opponent)
					.addStringOption(title)