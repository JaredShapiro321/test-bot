// TODO: Make sure this function isn't super broken.
toJSON = (object) => {
    let result = {};

    if (object !== undefined && object.constructor.name === 'Collection') {
        object.forEach((value, key) => {
            switch (value.constructor.name) {                
                case 'Role': 
                    result[object.get(key)['name']] = toJSON(value);
                    break;
                default:
                    result[key] = toJSON(value);
                    break;
            }
        });
    } else if (typeof object === 'object' && object !== undefined) {
        for (item in object) {
            result[item] = toJSON(object[item]);
        }
    } else {
        result = object;
    }

    return result;
}


module.exports = toJSON;