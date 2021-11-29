module.exports = async (client, interaction) => {
  if (!(interaction.isCommand() || interaction.isButton())) return;

  if (interaction.isCommand()) {
    console.log(client.commands);
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    

    try {
      await command.execute(client, interaction);
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  } else if (interaction.isButton()) {
    command = client.commands.get(interaction.message.interaction.commandName);
    split = interaction.customId.split("|");
    team = split[0];
    buttonId = split[1];
    messageId = split[2];

    try {
      switch (buttonId) {
        case 'delete-yes':
          await command.confirmDelete(client, interaction, team, messageId);
          break;
        case 'delete-no':
          await command.cancelDelete(client, interaction, team, messageId);
          break;
        default:
          break;
      }
    } catch (error) {
          console.error(error);
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
};