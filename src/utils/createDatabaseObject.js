const { Config, Role, Command, DatabaseObject } = require('../datatypes');

module.exports = (object) => {
    if (object instanceof DatabaseObject) {
        switch (typeOf(object)) {
            case 'Config':
                return new Config(object.id, object.roles, object.commands)
            case 'Role':
                return new Role(object.id, object.name, object.guild);
            case 'Command':
                return new Command(object.id, object.name, object.roles);
            default:
                return new DatabaseObject(object.id);
        }
    } else {
        return {};
    }
}