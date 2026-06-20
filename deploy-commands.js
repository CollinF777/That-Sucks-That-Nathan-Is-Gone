require("dotenv").config();

const fs = require("fs");
const { REST, Routes } = require("discord.js");

// Array that will contain all commands
const commands = [];

// Find every command file
const commandFiles = fs
    .readdirSync("./src/commands")
    .filter(file => file.endsWith(".js"));

// Import each command and add it to array
for (const file of commandFiles) {

    const command =
        require(`./src/commands/${file}`);

    commands.push(command.data.toJSON());
}

// Create REST client
const rest = new REST({ version: "10" })
    .setToken(process.env.TOKEN);

(async () => {

    try {

        console.log("Registering slash commands...");

        // Register commands globally
        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID
            ),
            { body: commands }
        );

        console.log("Commands registered.");

    } catch (error) {
        console.error(error);
    }

})();