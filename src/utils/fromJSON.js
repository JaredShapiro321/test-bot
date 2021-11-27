const { Config, Role, Command } = require('../datatypes');
const { Collection } = require('discord.js');

//TODO: Morning Jared, this command is broken rn. Just make the recurrsion work correctly instead of doing whatever this garbage is.
fromJSON = (object) => {
    let result = {};


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

    return result;
}

module.exports = fromJSON;