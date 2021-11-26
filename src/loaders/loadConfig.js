const { generateFromGuild, readFromFile } = require('../services/ConfigService.js');

module.exports = async (client, guildId, log) => {
    const path = '../config.json';
    const generateConfigFromGuild = false;
    let config = {};

    if (generateConfigFromGuild) {
        config = await generateFromGuild(client, guildId);
    } else {
        config = readFromFile(path, client);
    }

    if (log) {
        console.log('Config loaded: ', config);
    }

    return config;
}