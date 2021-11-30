const { roleReq, dayReq, titleReq, opponent, startTime } = require('../../../options');

module.exports = subcommand => subcommand.setName('event')
					.setDescription('Remove an event from the schedule.')
					.addRoleOption(roleReq)
					.addIntegerOption(dayReq)
					.addStringOption(titleReq)
					.addStringOption(opponent)
					.addStringOption(startTime)