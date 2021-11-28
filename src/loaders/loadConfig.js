const { generateFromGuild, generateFromFile, exportToFile } = require('../services/ConfigService.js');
const { isValid } = require('../config/config.js');

module.exports = async (client, guildId, forceGenerate, output) => {
    let config = generateFromFile(client);
    let regenerate = false;

    if (forceGenerate) {
        console.log('Force regenerating config file...');
        regenerate = true;
    } else if (config.length === 0) {
        console.log('Config file is empty. Regenerating...');
        regenerate = true;
    } else if (!isValid(config)) {
        console.log('Config file is invalid. Regenerating...');
        regenerate = true;
    }

    if (regenerate) {
        try {
            config = await generateFromGuild(client, guildId);
            exportToFile(client);
        } catch (error) {
            console.log(error);
        } 
    }
    
    if (output) {
        console.log('Config loaded: ', config);
    } else {
        console.log('Config loaded.')
    }

    client.config = config;
}