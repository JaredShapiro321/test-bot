const capitalize = require('./capitalize.js')

module.exports = (object) => {
    if (object === null) {
        return 'Null'
    } if (typeof object === 'object') {
        if (Array.isArray(object)) {
            return 'Array';
        } else {
            return object.constructor.name;
        }
    } else if (typeof object === 'string') {
        return 'String';
    } else if (typeof object === 'number') {
        if (Number.isNaN(object)) {
            return 'NaN';
        } else if (Number.isInteger(object)) {
            return 'Integer';
        } else {
            return 'Float';
        }
    } else {
        return capitalize(typeof object);
    }
}