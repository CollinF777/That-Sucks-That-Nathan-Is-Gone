const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("discord.js");

const DATA_FILE = path.join(__dirname, "../../data.json");

module.exports = {

    /*
     * /days
     *
     * Shows current day count
     */
    data: new SlashCommandBuilder()
        .setName("days")
        .setDescription("Gone but never forgotten."),

    async execute(interaction) {
        const data = JSON.parse(
            fs.readFileSync(DATA_FILE)
        );

        await interaction.reply(
            `Nathan died **${data.days}** days ago :(`
        );
    }
};
