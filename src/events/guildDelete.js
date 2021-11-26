module.exports = (client, guild) => {
// When the bot leaves or is kicked, delete settings to prevent stale entries.
  client.settings.delete(guild.id);
};