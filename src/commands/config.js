const { SlashCommandBuilder } = require('@discordjs/builders');

const options = {
  	'value': option => option.setName('value')
  					.setDescription('The configuration file value.'),
  	'value_req': option => option.setName('value')
  					.setDescription('The configuration file value.')
  					.setRequired(true),
}

const subcommands = {
  	'edit': subcommand => subcommand.setName('edit')
  					.setDescription('Edit the specified value in the configuration file.')
  					.addStringOption(options.value_req),
    'add': subcommand => subcommand.setName('add')
            .setDescription('Add a specified value to the configuration file.')
            .addStringOption(options.value_req),
    'remove': subcommand => subcommand.setName('remove')
            .setDescription('Remove the specified value from the configuration file.')
            .addStringOption(options.value_req),
    'display': subcommand => subcommand.setName('display')
            .setDescription('Display the configuration file or the specified value.')
            .addStringOption(options.value),
}

module.exports = {
	data: new SlashCommandBuilder().setName('config')
		.setDescription('Configuration command.')
        .addSubcommand(subcommands.edit)
        .addSubcommand(subcommands.add)
        .addSubcommand(subcommands.remove)
        .addSubcommand(subcommands.display)
        .setDefaultPermission(true),
    async execute(client, interaction) {
        const value = interaction.options.getString('value');
        const member = await interaction.member.fetch();

        console.log('client config: ', client.config);

        if (!(value in client.config)) {
            return interaction.reply("This key is not in the configuration.");
        }

        // Now we can finally change the value. Here we only have strings for values 
        // so we won't bother trying to make sure it's the right type and such. 
        //client.settings.set(message.guild.id, value.join(" "), prop);

        // We can confirm everything's done to the client.
        //message.channel.send(`Guild configuration item ${prop} has been changed to:\n\`${value.join(" ")}\``);

        switch (interaction.options.getSubcommand()) {
            case 'edit':
                console.log('edit');

                return interaction.reply({content: "Guild configuration item has been changed.", ephemeral: true});
            case 'add':
                console.log('add');
                return interaction.reply({content: "Guild configuration item has been changed.", ephemeral: true});
            case 'remove':
                console.log('remove');
                
                return interaction.reply({content: "Guild configuration item has been changed.", ephemeral: true});
            case 'display':
                console.log('display');
                
                return interaction.reply({content: "Guild configuration item has been changed.", ephemeral: true});
            default:
                console.log('default');
                
                return interaction.reply({content: "Guild configuration item has been changed.", ephemeral: true});
        }
    }
}