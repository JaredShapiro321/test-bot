const { bindEvents } = require('../services/EventService.js');
const { isValid } = require('../config/config.js');

module.exports = async (client) => {
	if (bindEvents(client)) {
    	console.log('Events loaded.')
    } else {
    	console.log('Error loading events.')
    }
}


