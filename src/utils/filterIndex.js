const fs = require('fs');
module.exports = (file) => {
	if (file.endsWith('.js') && file !== 'index.js') return file;
};