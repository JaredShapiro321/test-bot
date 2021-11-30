const { roleReq, dayReq, titleReq, startTime, endTime, length, notes } = require('../../../options');

module.exports = subcommand => subcommand.setName('other')
					.setDescription('Add anything else not specified to the schedule.')
					.addRoleOption(roleReq)
					.addIntegerOption(dayReq)
					.addStringOption(titleReq)
					.addStringOption(startTime)
					.addStringOption(endTime)
					.addStringOption(length)
					.addStringOption(notes)

