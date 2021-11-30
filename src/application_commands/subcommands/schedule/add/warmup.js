const { roleReq, dayReq, opponent, startTimeReq, endTime, length, notes } = require('../../../options');

module.exports = subcommand => subcommand.setName('warmup')
					.setDescription('Add a warmup to the schedule.')
					.addRoleOption(roleReq)
					.addIntegerOption(dayReq)
					.addStringOption(startTimeReq)
					.addStringOption(opponent)
					.addStringOption(endTime)
					.addStringOption(length)
					.addStringOption(notes)