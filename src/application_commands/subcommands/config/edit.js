const { valueReq } = require('../options');
module.exports = {
	edit: subcommand => subcommand.setName('edit')
  					.setDescription('Edit the specified value in the configuration file.')
  					.addStringOption(options.valueReq),
  				}