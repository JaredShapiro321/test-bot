const { typeOf } = require('../utils')
module.exports = {
	isValid (id) {
		return (typeOf(id) === 'String');
	}
}