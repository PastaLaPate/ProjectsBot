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

//COMMAND
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
          new MessageButton()
          .setCustomId('view')
          .setLabel("View projects")
          .setStyle('SUCCESS'),
            );
          await interaction.reply({ content: 'The list of commands :', components: [row]});
      }
      const filter = i => i.customId === 'create' || i.customId === 'view';

      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

      collector.on('collect', async i => {
        if (i.customId === 'create') {
          await i.update({ content: 'JSON FILE', components: [] });
        } else if (i.customId === "view") {
          var result = viewProject("Inventaire");
          console.log(result);
          await i.update({ content: result, components: [] });
        }
      });

      collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    });


function viewProject(projectName) {
  console.log("1");
  try {

      const data = fs.readFileSync('./db.json', 'utf8');
      console.log("2");
      // parse JSON string to JSON object
      const databases = JSON.parse(data);
      var finished = false;

      // print all databases
      databases.forEach(db => {
          if (finished) return;
          console.log("3");
          if (db.name === projectName) {
            console.log("4");
            var result = ""
            var type = db.type
            db.completed.forEach(completed => {
              console.log("5");
              result = result + ` | ${completed.name}`
            })
            console.log(result)
            finished = true;
            return result;
          }
      });

  } catch (err) {
      console.log("10");
      console.log(`Error reading file from disk: ${err}`);
  }
};

// Login to Discord with your client's token
client.login(token);