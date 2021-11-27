const { generateFromGuild, generateFromFile } = require('../services/ConfigService.js');

module.exports = async (client, guildId, forceGenerate, output) => {
    let config = !forceGenerate ? generateFromFile(client) : undefined;

    if (config === undefined) {
        try {
            config = await generateFromGuild(client, guildId);
        } catch (error) {
            console.log(error);
        }
    }

    if (output) {
        console.log('Config loaded: ', config);
    }

    client.config = config;
}