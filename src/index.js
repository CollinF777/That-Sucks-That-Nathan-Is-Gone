const express = require("express");
const app = express();
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const { Client, Collection, GatewayIntentBits } = require("discord.js");

// Simple web server so Render is happy
app.get("/", (req, res) => {
    res.send("Discord bot is running");
});

// Create a discord client
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Path to our data file
const DATA_FILE = path.join(__dirname, "../data.json");

// store commands
client.commands = new Collection();

// load command files
const commandsPath = fs
    .readdirSync(path.join(__dirname, "commands"))
    .filter((file) => file.endsWith(".js"));

for (const file of commandsPath) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// fires bot on log in
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);

     /*
     * Schedule a task that runs every day at midnight.
     *
     * Cron format:
     * ┌──────── minute
     * │ ┌────── hour
     * │ │ ┌──── day of month
     * │ │ │ ┌── month
     * │ │ │ │ ┌ day of week
     * │ │ │ │ │
     * 0 0 * * *
     *
     * Meaning: run at midnight every day.
     */
    cron.schedule("0 0 * * *", async () => {
        // Read current timer data
        const data = JSON.parse(
            fs.readFileSync(DATA_FILE)
        );

        // Dont do anything without the timer running
        if (!data.running) {
            return;
        }

        // add one day
        data.days++;

        // Save the updated timer data
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(data, null, 2)
        );

        try {
            // Fetch the channel and send the update message
            const channel = await client.channels.fetch(
                process.env.CHANNEL_ID
            );
            
            await channel.send(
                `It's been **${data.days}** day(s) since Nathan has died :(`
            );
        } catch (error) {
            console.error(
                "Error sending message to channel:",
                error
            );
        }
    });
});

// Run when a slash command is used
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    // Find command from collection
    const command = client.commands.get(
        interaction.commandName
    );

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`
        );
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(
            `Error executing ${interaction.commandName}:`,
            error
        );

        await interaction.reply({
            content: "There was an error while executing this command",
            ephemeral: true,
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`);
});

client.login(process.env.TOKEN);