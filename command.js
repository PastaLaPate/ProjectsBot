const { clientId, guildId, token } = require('./config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageActionRow, MessageButton } = require('discord.js');

const commands = [
      new SlashCommandBuilder().setName('project').setDescription('View project command')
    ]
      .map(command => command.toJSON());

    const rest = new REST({ version: '9' }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
      .then(() => console.log('Successfully registered application commands.'))
      .catch(console.error);