const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("discord.js");

// Path to timer data
const DATA_FILE = path.join(__dirname, "../../data.json");

module.exports = {
    /*
     * Defines the slash command
     *
     * /Nathan died :(
     * /Nathan died :( days:25
     */
    data: new SlashCommandBuilder()
        .setName("Nathan died :(")
        .setDescription("Starts the timer.")
        .addIntegerOption((option) =>
            option
                .setName("days")
                .setDescription("Number of days to start the timer at.")
                .setRequired(false)
        ),

    async execute(interaction) {
        // if no number is given, then start at 0 days
        const days = interaction.options.getInteger("days") ?? 0;

        const data = {
            days,
            running: true
        };

        // Save the timer data        
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(data, null, 2)
        );

        await interaction.reply(
            `Nathan died **${data.days}** ago :(.`
        );
    }
};