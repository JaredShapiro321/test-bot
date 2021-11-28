const fs = require('fs');
const { generateFromFiles, setPermissions } = require('../services/CommandService.js');

module.exports = async (client, guildId, output) => {
    client.commands = await generateFromFiles();

    await setPermissions(client, guildId);

    if (output) {
        console.log('Commands loaded: ', client.commands);
    } else {
        console.log('Commands loaded.');
    }
}