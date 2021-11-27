// Node Module Imports and Setup
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Collection } = require('discord.js');
const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const wait = require('util').promisify(setTimeout);
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

// Import sql model schemas

const calendarWeekData = require('../models/calendarWeek.js');
const calendarEventData = require('../models/calendarEvent.js');
const calendarEventsByWeekData = require('../models/calendarEventsByWeek.js');

// Initialize Sequelize instance
const sequelize = new Sequelize('sqlite:./database/test-bot.db');

// Create tables in database if they haven't been created already.
const CalendarWeek = sequelize.define(calendarWeekData.name, calendarWeekData.schema);
const CalendarEvent = sequelize.define(calendarEventData.name, calendarEventData.schema);
const CalendarEventsByWeek = sequelize.define(calendarEventsByWeekData.name, calendarEventsByWeekData.schema);

// Import subcommands
const subcommands = require('./subcommands/schedule');

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
        .setDefaultPermission(true),
	async execute(client, interaction) {
		try {
		  await sequelize.authenticate();
		  console.log('Connection to database has been established successfully.');
		} catch (error) {
		  console.error('Unable to connect to the database:', error);
		}

		const currentDate = dayjs().hour(0).minute(0).second(0).millisecond(0);
		const daysUntilSun = (6 - currentDate.day()) + 1;
		const team = interaction.options.getRole('team');

		let currentWeek = { 
												id: null,
												team: team.name,
												startDate: currentDate.add(daysUntilSun, 'day').toDate(),
												endDate: currentDate.add(daysUntilSun + 6, 'day').toDate(),
												messageId: null
											}

		CalendarWeek.sync();
			
		// Find matches for the arguments specified in the database
		calendarWeeks = await CalendarWeek.findAll({
			where: {
					team: team.name,
					startDate: currentWeek.startDate,
					endDate: currentWeek.endDate
			}	
		});

		if (interaction.options.getSubcommand() === 'create') {
			let events = [];

			if (calendarWeeks.length === 0) {
				await interaction.reply(formatMessage(team, currentWeek.startDate, currentWeek.endDate, events));
				await interaction.followUp({ content: `Successfully added schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true });

				// Get the last message sent in the channel. 
				// TODO: update to check that it has been sent by this bot.
				// TODO: also check if this message has been deleted and if so, actually do add it. probably should have an existsInDB and existsInMessages
				const channel = await client.channels.fetch(interaction.channelId);
				const messages = await channel.messages.fetch({ limit: 1 })
				const message = messages.first();

				await CalendarWeek.create({ team: team.name, startDate: currentWeek.startDate, endDate: currentWeek.endDate, messageId: message.id});
			} else {
				// Send error message reply
				await interaction.reply({ content: `A schedule already exists for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}\nMessage Id: ${calendarWeeks[0].dataValues.messageId}`, ephemeral: true });
			}
		} else if (interaction.options.getSubcommand() === 'delete') {
			if (calendarWeeks.length > 0) {
				currentWeek = calendarWeeks[0].dataValues;

				// Setup buttons
				const buttons = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`${team.name}|delete-yes|${currentWeek.messageId}`)
							.setLabel('Yes 👍')
							.setStyle('PRIMARY'),
						new MessageButton()
							.setCustomId(`${team.name}|delete-no|${currentWeek.messageId}`)
							.setLabel('No 👎')
							.setStyle('DANGER')
					);

				const disabledButtons = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`${team.name}|delete-yes|${currentWeek.messageId}`)
							.setLabel('Yes 👍')
							.setStyle('PRIMARY')
							.setDisabled(true),
						new MessageButton()
							.setCustomId(`${team.name}|delete-no|${currentWeek.messageId}`)
							.setLabel('No 👎')
							.setStyle('DANGER')
							.setDisabled(true),
					);

				// Send confirmation message.
				const reply = await interaction.reply({ content: `Are you sure you want to delete ${team.name} schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY')}?\n(Request will timeout after 10 seconds.)`, components: [buttons], ephemeral: true });
				
				await wait(10000);
				
				// Edit confirmation message (timeout)
				await interaction.editReply({ content: 'Request timed out', components: [disabledButtons], ephemeral: true });
			} else {
				// Send error message reply
				await interaction.reply({ content: `No ${team.name} schedule was found for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true });
			}
		} else if (interaction.options.getSubcommandGroup() === 'add' || interaction.options.getSubcommandGroup() === 'remove') {
			// If calendarWeek exists in database
			if (calendarWeeks.length > 0) {
				currentWeek = calendarWeeks[0].dataValues;

				// Get the channel and message by id.
				const channel = await client.channels.fetch(interaction.channelId);
				const message = await channel.messages.fetch(currentWeek.messageId);

				// Create a calendarEvent table if it does not exist already
				CalendarEvent.sync();

				const newEvent = createCalendarEvent(interaction, currentWeek.startDate);

				if (interaction.options.getSubcommandGroup() === 'add' ) {
					const calendarEvents = await CalendarEvent.findAll({
						where: {
								team: newEvent.team,
								date: newEvent.date,
								startTime: newEvent.startTime,
								endTime: newEvent.endTime,
								title: newEvent.title,
								type: newEvent.type,
								opponent: newEvent.opponent
						}
					});

					// TODO: Check if there are other events with conflicting time ranges.

					// If event does not exist already
					if (calendarEvents.length === 0) {
						const currentEvent = await CalendarEvent.create(newEvent);

						CalendarEventsByWeek.sync();
						const currentEventByWeek = await CalendarEventsByWeek.create({ id: interaction.id, team: team.name, calendarEvent: currentEvent.id, calendarWeek: currentWeek.id });

						// Pull all of the team's events this week from the database
						events = await getEvents(team.name, currentWeek.id);

						// Edit the schedule message's content
						message.edit(formatMessage(team, currentWeek.startDate, currentWeek.endDate, events));

						// Send confirmation reply
						await interaction.reply({ content: `Successfully added the ${team.name} ${newEvent.type} on ${dayjs(newEvent.date).format('dddd')} to the schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true });
					} else {
						// Event Does exist
						const errorMessage = "An event with this information already exists.";
						await interaction.reply({ content: errorMessage, ephemeral: true });
					}
				} else if (interaction.options.getSubcommandGroup() === 'remove') {
					const newEvent = createCalendarEvent(interaction, currentWeek.startDate);

					CalendarEvent.sync();
					
					// Remove matches for the arguments specified in the database
					const success = await CalendarEvent.destroy({
					  where: notNull(newEvent)
					});

					// Pull all of the team's events this week from the database
					events = await getEvents(team.name, currentWeek.id);

					// Update the schedule message's content
					message.edit(formatMessage(team, currentWeek.startDate, currentWeek.endDate, events));

					if (success < 1) {
						// Send Error reply
						await interaction.reply({content: `Could not remove the specified ${team.name} ${newEvent.type} on ${dayjs(newEvent.date).format('dddd')} from the schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true});
					} else {
						// Send Confirmation reply
						await interaction.reply({content: `Successfully removed the specified ${team.name} ${newEvent.type} on ${dayjs(newEvent.date).format('dddd')} from the schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true});
					}
				}
			} else {
				// Send error message reply
				await interaction.reply({ content: 'A calendar for this week does not exist for this team. To create one use "/schedule create *team*".', ephemeral: true });
			}
		}
	},

	// TODO: Make these buttons become disabled once pressed once.
	async confirmDelete(client, interaction, team, messageId) {
		const currentDate = dayjs().hour(0).minute(0).second(0).millisecond(0);
		const daysUntilSun = (6 - currentDate.day()) + 1;

		let currentWeek = { 
			id: null,
			team: team,
			startDate: currentDate.add(daysUntilSun, 'day').toDate(),
			endDate: currentDate.add(daysUntilSun + 6, 'day').toDate(),
			messageId: messageId
		}

		try {
			await sequelize.authenticate();
			console.log('Connection to database has been established successfully.');
		} catch (error) {
		  	console.error('Unable to connect to the database:', error);
		}

		CalendarWeek.sync();
		CalendarEvent.sync();
		CalendarEventsByWeek.sync();

		const channel = await client.channels.fetch(interaction.channelId);
		const message = await channel.messages.fetch(currentWeek.messageId);

		message.delete();


		// Find week match
		const calendarWeeks = await CalendarWeek.findAll({
			where: notNull(currentWeek)
		});

		// Find all events by in this week
		const eventsByWeekMatches = await CalendarEventsByWeek.findAll({
			where: {
					team: team,
					calendarWeek: calendarWeeks[0].id
			}
		});

		// Create an array of the week's events' ids
		let eventIds = [];
		for (let i = 0; i < eventsByWeekMatches.length; i++) {
			eventIds.push(eventsByWeekMatches[i].dataValues.event);
		}

		// Delete all of the calendar events that match the specified ids
		const success0 = await CalendarEvent.destroy({
			where: {
				id: {
					[Op.or]: eventIds
				}
			}
		});

		// Delete all maps from database
		const success1 = await CalendarEventsByWeek.destroy({
			where: {
					team: team,
					calendarWeek: calendarWeeks[0].id
			}
		});

		// Delete calendarWeek from database.
		const success2 = await CalendarWeek.destroy({
			where: notNull(currentWeek)
		});

		//console.log(success0, success1, success2);

		if (success0 !== eventIds.length || success1 !== eventsByWeekMatches.length || success2 < 1) {
			// Send error message reply
			await interaction.reply({content: `Could not delete the ${currentWeek.team} schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true});
		} else {
			// Send success message reply
			await interaction.reply({content: `Successfully deleted ${currentWeek.team} schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true});
		}
	},
	async cancelDelete(client, interaction, team, messageId) {
		const currentDate = dayjs().hour(0).minute(0).second(0).millisecond(0);
		const daysUntilSun = (6 - currentDate.day()) + 1;

		let currentWeek = { 
			id: null,
			team: team,
			startDate: currentDate.add(daysUntilSun, 'day').toDate(),
			endDate: currentDate.add(daysUntilSun + 6, 'day').toDate(),
			messageId: messageId
		}

		const channel = await client.channels.fetch(interaction.channelId);
		const message = await channel.messages.fetch(currentWeek.messageId);

		await interaction.reply({content: `Canceled deletion of ${currentWeek.team} schedule for ${dayjs(currentWeek.startDate).format('MMM. DD-')}${dayjs(currentWeek.endDate).format('DD, YYYY.')}`, ephemeral: true});
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

	console.log(interaction);
	return {
			id: interaction.id,
			team: interaction.options.getRole('team').name,
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
function formatMessage(team, startDate, endDate, events) {
	let messageContent = "Schedule for " + dayjs(startDate).format("MM-DD-YYYY") + " through "
				+ dayjs(endDate).format("MM-DD-YYYY") + " <@&" + team.id + ">\n\n";

	for (let i = 0; i < 7; i++) {
		let d = dayjs(startDate).add(i, 'day');
		let dateString = d.format('> (MM/DD) dddd: ');
		let dailyEvents = events.filter((e) => dayjs(e.date).isSame(d, 'day'));

		// TODO: sort dailyEvents by e.startTime; // If e.startTime doesnt exist, it goes to the front of the list.
		if (dailyEvents.length > 0) {
			let eventString = "";
			for (let j = 0; j < dailyEvents.length; j++) {
				const currentEvent = dailyEvents[j];

				if (currentEvent.startTime != null) {
					eventString += dayjs(currentEvent.startTime).format("h:mm");
				}

				eventString += (currentEvent.endTime != null) ? dayjs(currentEvent.endTime).format("-h:mm[ EST ]") : ' EST ';
				
				eventString += formatEvent(currentEvent);

				if (j < dailyEvents.length - 1) {
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

function formatEvent(event) {
	switch (event.type) {
		case 'match':
			return `**( ${event.title}:  ${event.opponent} )**`;
		case 'scrim':
			return `**(Scrim: ' ${event.opponent} )**`;
		case 'practice':
			return '**(Practice)**';
		case 'warm-up':
			if (event.opponent !== null) {
				return `**(Warm-up: ${event.opponent} )**`;
			} 
			return '**(Warm-up)**';
		case 'event': 
			return `**( ${event.title} )**`;
		case 'other':
			return `**( ${event.title} )**`;
		default:
			return '';
	}
}

function notNull(event) {
	return Object.fromEntries(Object.entries(event).filter(([_, v]) => v != null));
}

async function getEvents(team, id) {
	currentEventsByWeekMatches = await CalendarEventsByWeek.findAll({
		where: {
				team: team,
				calendarWeek: id
		}
	});

	// Create an array of the week's events' ids
	let eventIds = [];
	for (let i = 0; i < currentEventsByWeekMatches.length; i++) {
		eventIds.push(currentEventsByWeekMatches[i].dataValues.event);
	}

	// Pull all of the calendar events that match the specified ids
	currentEventsByWeek = await CalendarEvent.findAll({
		where: {
			id: {
				[Op.or]: eventIds
			}
		}
	});
	
	// Put the event's data values into an array for use in formatting.
	events = [];
	for (const e of currentEventsByWeek) {
  		events.push(e.dataValues);
	} 

	return events;
}