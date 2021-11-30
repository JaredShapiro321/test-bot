const { roleReq, notes, startDate } = require('../../options');

module.exports = subcommand => subcommand.setName('delete')
				.setDescription('Delete a schedule of the specified role.')
				.addRoleOption(roleReq)
				.addStringOption(startDate)
				.addStringOption(notes)