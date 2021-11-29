const { teamReq, notes, startDate } = require('../../options');

module.exports = subcommand => subcommand.setName('delete')
				.setDescription('Delete a schedule of the specified team.')
				.addRoleOption(teamReq)
				.addStringOption(startDate)
				.addStringOption(notes)