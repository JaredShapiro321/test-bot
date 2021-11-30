// Node Module Imports and Setup
require('dotenv').config({path: '../../../.env'});
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Collection } = require('discord.js');
const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const wait = require('util').promisify(setTimeout);
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

// Import subcommands
const subcommands = require('../subcommands/schedule');
dayjs.extend(customParseFormat);
const { CalendarEvent, CalendarWeek } = require('../../datatypes/');

// TODO: make a sequelize initialize helper function that initializes all of the things in an array you pass in.


// TODO: MORNING JARED: 
// make schedule add command work
// need to do get indexing by calendarWeek working and whatnot.


// TODO: Refresh schedule command (inside schedule channel)
// TODO: Notes command for whole week (create, update, delete), 
// TODO: Add a weekly message command (create, update, delete)
// TODO: update event command
// TODO: display schedule command (localized / outside of schedule channel)
module.exports = {
	// TODO: Add note subcommand. To make notes on a specific day. (Only takes day and notes)
	data: new SlashCommandBuilder().setName('schedule')
		.setDescription('Schedule command.')
		.addSubcommandGroup(subcommandGroup => 
			subcommandGroup.setName('add')
				.setDescription('Add a new event.')
				.addSubcommand(subcommands.add.match)
				.addSubcommand(subcommands.add.scrim)
				.addSubcommand(subcommands.add.warmup)
				.addSubcommand(subcommands.add.practice)
				.addSubcommand(subcommands.add.event)
				.addSubcommand(subcommands.add.other))
		.addSubcommandGroup(subcommandGroup => 
			subcommandGroup.setName('remove')
				.setDescription('Remove a schedule or schedule event.')
				.addSubcommand(subcommands.remove.match)
				.addSubcommand(subcommands.remove.scrim)
				.addSubcommand(subcommands.remove.warmup)
				.addSubcommand(subcommands.remove.practice)
				.addSubcommand(subcommands.remove.event)
				.addSubcommand(subcommands.remove.other))
		.addSubcommand(subcommands.create)
		.addSubcommand(subcommands.delete)
        .setDefaultPermission(false),
	async execute(client, interaction) {
		// Initialize Sequelize instance
		const { setupSequelize } = require('../../sequelize/sequelize.js');
		sequelize = await setupSequelize(['CalendarEvent', 'CalendarWeek']);

		const role = interaction.options.getRole('role');

		const currentDate = dayjs().hour(0).minute(0).second(0).millisecond(0);
		const daysUntilSun = (6 - currentDate.day()) + 1;
		
		const startDate = currentDate.add(daysUntilSun, 'day').toDate();
		const endDate = currentDate.add(daysUntilSun + 6, 'day').toDate();

		let currentWeek = new CalendarWeek(null, role.name, startDate, endDate);

		await sequelize.models.CalendarWeek.sync();

		// Find matches for the arguments specified in the database
		calendarWeeks = await sequelize.models.CalendarWeek.findAll({
			where: notNull(currentWeek)
		});

		if (interaction.options.getSubcommand() === 'create') {
			if (calendarWeeks.length === 0) {
				let calendarEvents = [];
				await interaction.reply(formatMessage(role, currentWeek.startDate, currentWeek.endDate, calendarEvents));
				await interaction.followUp({ content: `Successfully created schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true });

				// Get the last message sent in the channel. 
				// TODO: update to check that it has been sent by this bot.
				// TODO: also check if this message has been deleted and if so, actually do add it. probably should have an existsInDB and existsInMessages
				const channel = await client.channels.fetch(interaction.channelId);
				const messages = await channel.messages.fetch({ limit: 1 })
				const message = messages.first();

				currentWeek.id = message.id;

				await sequelize.models.CalendarWeek.create(currentWeek);
			} else {
				// Send error message reply
				currentWeek.id = calendarWeeks[0].dataValues.id;
				await interaction.reply({ content: `A schedule already exists for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}\nId: ${currentWeek.id}`, ephemeral: true });
			}
		} else if (interaction.options.getSubcommand() === 'delete') {
			if (calendarWeeks.length > 0) {
				currentWeek = calendarWeeks[0].dataValues;

				// Setup buttons
				const buttons = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`${role.name}|delete-yes|${currentWeek.id}`)
							.setLabel('Yes 👍')
							.setStyle('PRIMARY'),
						new MessageButton()
							.setCustomId(`${role.name}|delete-no|${currentWeek.id}`)
							.setLabel('No 👎')
							.setStyle('DANGER')
					);

				const disabledButtons = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`${role.name}|delete-yes|${currentWeek.id}`)
							.setLabel('Yes 👍')
							.setStyle('PRIMARY')
							.setDisabled(true),
						new MessageButton()
							.setCustomId(`${role.name}|delete-no|${currentWeek.id}`)
							.setLabel('No 👎')
							.setStyle('DANGER')
							.setDisabled(true),
					);

				// Send confirmation message.
				const reply = await interaction.reply({ content: `Are you sure you want to delete ${role.name} schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY')}?\n(Request will timeout after 10 seconds.)`, components: [buttons], ephemeral: true });
				
				await wait(10000);
				
				// Edit confirmation message (timeout)
				await interaction.editReply({ content: 'Request timed out', components: [disabledButtons], ephemeral: true });
			} else {
				// Send error message reply
				await interaction.reply({ content: `No ${role.name} schedule was found for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true });
			}
		} else if (interaction.options.getSubcommandGroup() === 'add' || interaction.options.getSubcommandGroup() === 'remove') {
			// If calendarWeek exists in database
			if (calendarWeeks.length > 0) {
				currentWeek = calendarWeeks[0].dataValues;

				// Get the channel and message by id.
				const channel = await client.channels.fetch(interaction.channelId);
				const message = await channel.messages.fetch(currentWeek.id);

				// Create a calendarEvent table if it does not exist already
				sequelize.models.CalendarEvent.sync();

				const eventDate = dayjs(currentWeek.startDate).add(interaction.options.getInteger('day'), 'day').hour(0).minute(0).second(0).millisecond(0);
				let startTime = dayjs(interaction.options.getString('start-time'), ['h', 'hh', 'h:mm', 'hh:mm'], 'en', true);
				let endTime = dayjs(interaction.options.getString('end-time'), ['h', 'hh', 'h:mm', 'hh:mm'], 'en', true);
				startTime = (startTime.isValid()) ? eventDate.hour(startTime.hour()).minute(startTime.minute()).toDate() : null;
				endTime = (endTime.isValid()) ? eventDate.hour(endTime.hour()).minute(endTime.minute()).toDate() : null;

				const newEvent = new CalendarEvent(
					interaction.id,
					interaction.options.getSubcommand(),
					currentWeek.id,
					interaction.options.getRole('role').name,
					eventDate.toDate(),
					startTime,
					endTime,
					interaction.options.getString('title'),
					interaction.options.getString('opponent'),
					interaction.options.getString('notes'));

				if (interaction.options.getSubcommandGroup() === 'add' ) {
					const calendarEventMatches = await sequelize.models.CalendarEvent.findAll({
						where: notNull(newEvent)
					});

					// TODO: Check if there are other events with conflicting time ranges.

					// If event does not exist already
					if (calendarEventMatches.length === 0) {
						const currentEvent = await sequelize.models.CalendarEvent.create(newEvent);

						// TODO: UPdate week


						// Pull all of the role's events this week from the database
						const calendarEvents = await sequelize.models.CalendarEvent.findAll({
							where: {
								calendarWeek: currentWeek.id
							}
						});

						// Edit the schedule message's content
						message.edit(formatMessage(role, currentWeek.startDate, currentWeek.endDate, calendarEvents));

						// Send confirmation reply
						await interaction.reply({ content: `Successfully added the ${role.name} ${newEvent.eventType} on ${dayjs(newEvent.date).format('dddd')} to the schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true });
					} else {
						// Event Does exist
						const errorMessage = "An event with this information already exists.";
						await interaction.reply({ content: errorMessage, ephemeral: true });
					}
				} else if (interaction.options.getSubcommandGroup() === 'remove') {
					const newEvent = new CalendarEvent(
					null,
					interaction.options.getSubcommand(),
					currentWeek.id,
					interaction.options.getRole('role').name,
					eventDate.toDate(),
					startTime,
					endTime,
					interaction.options.getString('title'),
					interaction.options.getString('opponent'),
					interaction.options.getString('notes'));

					sequelize.models.CalendarEvent.sync();

					// Remove matches for the arguments specified in the database
					const success = await sequelize.models.CalendarEvent.destroy({
					  where: notNull(newEvent)
					});

					// Pull all of the role's events this week from the database
					const calendarEvents = await sequelize.models.CalendarEvent.findAll({
						where: {
							calendarWeek: currentWeek.id
						}
					});

					// Update the schedule message's content
					message.edit(formatMessage(role, currentWeek.startDate, currentWeek.endDate, calendarEvents));

					if (success < 1) {
						// Send Error reply
						await interaction.reply({content: `Could not remove the specified ${role.name} ${newEvent.eventType} on ${dayjs(newEvent.date).format('dddd')} from the schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true});
					} else {
						// Send Confirmation reply
						await interaction.reply({content: `Successfully removed the specified ${role.name} ${newEvent.eventType} on ${dayjs(newEvent.date).format('dddd')} from the schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true});
					}
				}
			} else {
				// Send error message reply
				await interaction.reply({ content: 'A calendar for this week does not exist for this role. To create one use "/schedule create *role*".', ephemeral: true });
			}
		}
	},

	// TODO: Make these buttons become disabled once pressed once.
	async confirmDelete(client, interaction, role, id) {
		// Get current date.
		const currentDate = dayjs().hour(0).minute(0).second(0).millisecond(0);
		const daysUntilSun = (6 - currentDate.day()) + 1;
		
		const startDate = currentDate.add(daysUntilSun, 'day').toDate();
		const endDate = currentDate.add(daysUntilSun + 6, 'day').toDate();

		let currentWeek = new CalendarWeek (id, role, startDate, endDate);

		// Initialize Sequelize instance
		const { setupSequelize } = require('../../sequelize/sequelize.js');
		sequelize = await setupSequelize(['CalendarEvent', 'CalendarWeek']);

		sequelize.models.CalendarWeek.sync();
		sequelize.models.CalendarEvent.sync();

		const channel = await client.channels.fetch(interaction.channelId);
		const message = await channel.messages.fetch(currentWeek.id);

		message.delete();


		// Find week match
		const calendarWeeks = await sequelize.models.CalendarWeek.findAll({
			where: notNull(currentWeek)
		});

		const currentWeekMatch = calendarWeeks[0];


		const calendarEvents = await sequelize.models.CalendarEvent.findAll({
			where: {
				calendarWeek: currentWeek.id
			}
		});

		// Delete all of the calendar events that match the specified ids
		const success0 = await sequelize.models.CalendarEvent.destroy({
			where: {
				calendarWeek: currentWeek.id
			}
		});

		// Delete calendarWeek from database.
		const success1 = await sequelize.models.CalendarWeek.destroy({
			where: notNull(currentWeek)
		});

		if (success0 !== calendarEvents.length || success1 < 1) {
			// Send error message reply
			await interaction.reply({content: `Could not delete the ${currentWeek.role} schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true});
		} else {
			// Send success message reply
			await interaction.reply({content: `Successfully deleted ${currentWeek.role} schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true});
		}
	},
	async cancelDelete(client, interaction, role, id) {
		const currentDate = dayjs().hour(0).minute(0).second(0).millisecond(0);
		const daysUntilSun = (6 - currentDate.day()) + 1;

		const startDate = currentDate.add(daysUntilSun, 'day').toDate();
		const endDate = currentDate.add(daysUntilSun + 6, 'day').toDate();

		let currentWeek = new CalendarWeek (id, role, startDate, endDate);

		const channel = await client.channels.fetch(interaction.channelId);
		const message = await channel.messages.fetch(currentWeek.id);

		await interaction.reply({content: `Canceled deletion of ${currentWeek.role} schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true});
	},
};

// Helper functions

/* 
 * Name: createCalendarEvent
 * Description: creates a calendar event based off of the given Discord interaction and currentWeek.startDate. 
 */
function createCalendarEvent(interaction, startDate) {
	const eventDate = dayjs(startDate).add(interaction.options.getInteger('day'), 'day').hour(0).minute(0).second(0).millisecond(0);
	const startTime = dayjs(interaction.options.getString('start-time'), ['h', 'hh', 'h:mm', 'hh:mm'], 'en', true);
	const endTime = dayjs(interaction.options.getString('end-time'), ['h', 'hh', 'h:mm', 'hh:mm'], 'en', true);
	// TODO: get eventLength working.
	// const eventLength = dayjs(interaction.options.getString('length'), ['h', 'hh', 'h:mm', 'hh:mm'], 'en', true);

	return {
			id: interaction.id,
			role: interaction.options.getRole('role').name,
			date: eventDate.toDate(),
			title: interaction.options.getString('title'),
			startTime: (startTime.isValid()) ? eventDate.hour(startTime.hour()).minute(startTime.minute()).toDate() : null,
			endTime: (endTime.isValid()) ? eventDate.hour(endTime.hour()).minute(endTime.minute()).toDate() : null,
			type: interaction.options.getSubcommand(),
			opponent: interaction.options.getString('opponent'),
			notes: interaction.options.getString('notes')
	};
}

// TODO: Add a display for total time commitment per week.
function formatMessage(role, startDate, endDate, calendarEvents) {
	let messageContent = "Schedule for " + dayjs(startDate).format("MM-DD-YYYY") + " through "
				+ dayjs(endDate).format("MM-DD-YYYY") + " <@&" + role.id + ">\n\n";

	for (let i = 0; i < 7; i++) {
		let d = dayjs(startDate).add(i, 'day');
		let dateString = d.format('> (MM/DD) dddd: ');
		let currentEvents = calendarEvents.filter((e) => dayjs(e.date).isSame(d, 'day'));

		// TODO: sort currentEvents by e.startTime; // If e.startTime doesnt exist, it goes to the front of the list.
		if (currentEvents.length > 0) {
			let eventString = "";
			for (let j = 0; j < currentEvents.length; j++) {
				const currentEvent = currentEvents[j];

				if (currentEvent.startTime != null) {
					eventString += dayjs(currentEvent.startTime).format("h:mm");
				}

				eventString += (currentEvent.endTime != null) ? dayjs(currentEvent.endTime).format("-h:mm[ EST ]") : ' EST ';
				
				eventString += formatEvent(currentEvent);

				if (j < currentEvents.length - 1) {
					eventString += " | ";
				}
			}

			messageContent += dateString + eventString + "\n";
		} else {
			messageContent += dateString + "Off\n";
		}	
	}

	messageContent += "\n__**Notes:**__\n";

	return messageContent;
}

function formatEvent(calendarEvent) {
	switch (calendarEvent.eventType) {
		case 'match':
			return `**Match ( ${calendarEvent.title}:  ${calendarEvent.opponent} )**`;
		case 'scrim':
			return `**Scrim ( ${calendarEvent.opponent} )**`;
		case 'practice':
			return '**Practice**';
		case 'warmup':
			if (calendarEvent.opponent !== null) {
				return `**Warmup ( ${calendarEvent.opponent} )**`;
			} 
			return '**Warmup**';
		case 'event': 
			return `**${calendarEvent.title}**`;
		case 'other':
			return `**${calendarEvent.title}**`;
		default:
			return '';
	}
}

function notNull(calendarEvent) {
	return Object.fromEntries(Object.entries(calendarEvent).filter(([_, v]) => v != null));
}

async function getEvents(role, id) {
	currentEventsMatches = await CalendarEvents.findAll({
		where: {
				role: role,
				calendarWeek: id
		}
	});

	// Create an array of the week's events' ids
	let calendarEventIds = [];
	for (let i = 0; i < currentEventsMatches.length; i++) {
		currentEventIds.push(currentEventsMatches[i].dataValues.event);
	}

	// Pull all of the calendar events that match the specified ids
	currentEvents = await CalendarEvent.findAll({
		where: {
			id: {
				[Op.or]: calendarEventIds
			}
		}
	});
	
	// Put the event's data values into an array for use in formatting.
	calendarEvents = [];
	for (const e of currentEvents) {
  		calendarEvents.push(e.dataValues);
	} 

	return calendarEvents;
}