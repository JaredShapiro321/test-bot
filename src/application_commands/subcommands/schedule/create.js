const { roleReq, startDate, notes } = require('../../options');

module.exports = subcommand => subcommand.setName('create')
					.setDescription('Create a new schedule for the specified role.')
					.addRoleOption(roleReq)
					.addStringOption(startDate)
					.addStringOption(notes)