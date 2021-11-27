const fs = require('fs');
const { generateFromFiles, setPermissions } = require('../services/CommandService.js');

module.exports = async (client, guildId, log) => {
    client.commands = generateFromFiles();

    await setPermissions(client, guildId);

    console.log('Commands loaded');
}