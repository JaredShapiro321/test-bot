const { roleReq, dayReq, titleReq, opponent, startTime } = require('../../../options');

module.exports = subcommand => subcommand.setName('other')
					.setDescription('Remove anything not specified from the schedule.')
					.addRoleOption(roleReq)
					.addIntegerOption(dayReq)
					.addStringOption(titleReq)
					.addStringOption(opponent)
					.addStringOption(startTime)