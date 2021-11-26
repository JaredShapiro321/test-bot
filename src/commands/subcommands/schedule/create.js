const { teamReq, startDate, notes } = require('../../options');

module.exports = subcommand => subcommand.setName('create')
					.setDescription('Create a new schedule for the specified team.')
					.addRoleOption(teamReq)
					.addStringOption(startDate)
					.addStringOption(notes)