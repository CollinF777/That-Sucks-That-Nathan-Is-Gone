const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("discord.js");

const DATA_FILE = path.join(__dirname, "../../data.json");

module.exports = {
    /*
     * /He Lives!
     *
     * Sets counter back to 0
     */
    data: new SlashCommandBuilder()
        .setName("He-Lives")
        .setDescription("Resets the timer."),
    
    async execute(interaction) {
        const data = {
            days: 0,
            running: true
        };

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(data, null, 2)
        );

        await interaction.reply(
            `Nathan is alive! The timer has been reset.`
        );
    }
};