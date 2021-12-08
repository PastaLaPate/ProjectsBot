// DISCORD

const { Client, Intents } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageActionRow, MessageButton } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// LIBS

const fs = require('fs');

// DB

let test = {
  name: "SCRIPTING",
  type: "Devlopement"
}

fs.readFile('./db.json', 'utf8', (err, data) => {

    if (err) {
        console.log(`Error reading file from disk: ${err}`);
    } else {

        // parse JSON string to JSON object
        const databases = JSON.parse(data);

        // add a new record
        databases.push({
            name: 'Postgres',
            type: 'RDBMS'
        });

        // write new data back to the file
        console.log("Succesfully readFile")
        fs.writeFile('./db.json', JSON.stringify(databases, null, 4), (err) => {
            if (err) {
                console.log(`Error writing file: ${err}`);
            } else {
              console.log("Succesfully writeFile")
            }
        });
    }

});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

//COMMANDS
  //REGISTER COMMANDS

    const commands = [
      new SlashCommandBuilder().setName('project').setDescription('View project command')
    ]
      .map(command => command.toJSON());

    const rest = new REST({ version: '9' }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
      .then(() => console.log('Successfully registered application commands.'))
      .catch(console.error);
  //INTERACT COMMANDS
    client.on('interactionCreate', async interaction => {
      if (!interaction.isCommand() && !interaction.isButton()) return;

      const { commandName } = interaction;

      if (commandName === 'project') {
        const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
          .setCustomId('create')
          .setLabel('Create')
          .setStyle('SUCCESS'),
           );

          await interaction.reply({ content: 'The list of commands :', components: [row]});
      }
      const filter = i => i.customId === 'create';

      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

      collector.on('collect', async i => {
        if (i.customId === 'create') {

          await i.update({ content: 'JSON FILE', components: [] });
        }
      });

      collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    });


// Login to Discord with your client's token
client.login(token);