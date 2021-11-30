const { Config, Role, Command, DatabaseObject } = require('../datatypes');
const { Collection } = require('discord.js');

fromJSON = (object) => {
    let result = new DatabaseObject(object.id);

   

    // console.log('object:', object, 'type:', type);

    if (typeof object === 'object') {
        for (key in object) {
            const value = object[key];
            const type = typeOf(value);

            //console.log('object:', value, 'type:', type);

            switch (type) {
                case 'String': 
                    result[key] = value;
                    break;
                case 'Object':
                    console.log(value instanceof DatabaseObject);
                    break;
            }

            result[key] = fromJSON(object[key]);
        }
    }
    /*
    if (type === 'Object') {
        for (key in object) {



            result = new Collection();
            console.log(typeOf(object[key]));
            let r = fromJSON(object[key]);
            console.log(r);
            result.set(r);
            
            switch (key) {
                case 'roles': 
                    result[key] = new Collection();
                    for (key2 in object[key]) {
                        result[key].set(obj, newObject(object[key][obj]));
                    }
            }
            
            //console.log(typeOf(object[key]));
            
        }
    } else if (type === 'Role') {
        console.log("role!!")
        result = object;
    } else {
        result = object;
    }
    */

    /*
    if (typeof object === 'object') {
        switch (object.constructor.name) {
            case 'Config': 
                return new Config(object.guild, object.guild, {}, {});
            case 'Role':
                return new Role(object.id, object.name, object.guild);
            case 'Command':
                return new Command(object.id, object.name, object.roles);
        }

        for (key in object) {
            switch (key) {
                case 'roles':
                    result[key] = new Collection();
                    for (roleName in object[key]) {
                        result[key].set(roleName, new Role(object[key][roleName].id, object[key][roleName].name, object[key][roleName].guild));
                    }
                    break;
                case 'commands':
                    result[key] = new Collection();
                    for (commandName in object[key]) {
                        result[key].set(commandName, new Command(object[key][commandName].id, object[key][commandName].name, object[key][commandName].guild));
                    }
                    break;
                default:
                    result[key] = object[key];
                    break;
            }
            
            //fromJSON(object[key]);
        }
    } else {
        result = object;
    }
    */

    return result;
}

module.exports = fromJSON;