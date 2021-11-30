const { roleReq, dayReq, opponent, startTime, endTime, length, notes } = require('../../../options');

module.exports = subcommand => subcommand.setName('practice')
					.setDescription('Add a team practice to the schedule.')
					.addRoleOption(roleReq)
					.addIntegerOption(dayReq)
					.addStringOption(opponent)
					.addStringOption(startTime)
					.addStringOption(endTime)
					.addStringOption(length)
					.addStringOption(notes)