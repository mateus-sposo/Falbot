const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports = {
    category: 'Misc',
    description: 'Manda alguém para a horny jail',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<usuario>',
    expectedArgsTypes: ['USER'],
    options: [{
        name: 'usuario',
        description: 'usuario que vai ser mandado para a horny jail',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER
    }],
    callback: async ({message, interaction, user, args}) => {
        try {
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(message ? message : interaction, user.id))
            .setImage('https://i.kym-cdn.com/photos/images/original/002/051/072/a4c.gif')
            .setFooter({text: 'by Falcão ❤️'})
           if (message) {
               return embed
           } else {
               const member = await functions.getMember(interaction, args[0])
               await interaction.reply({
                   content: `${member} você foi bonked por ${user.username}`,
                   embeds: [embed]
               })
           }
        } catch (error) {
            console.error(`Bonk: ${error}`)
        }
    }
}