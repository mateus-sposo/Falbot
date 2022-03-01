const Discord = require('discord.js')
const Roll = require('roll')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports = {
    category: 'Fun',
    description: 'Roll dice for you',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<dice>',
    expectedArgsTypes: ['STRING'],
    options: [{
        name: 'dice',
        description: 'dice to be rolled',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }],
    callback: async ({instance, guild, message, interaction, user, text}) => {
        try {
            const roll = new Roll()
            text = text.replace(/\s/g,'')
    
            if (!roll.validate(text)) {
                return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: text})
            } else {
                rolled = roll.roll(text).result
                rolled = rolled.toString()
        
                if (message) {
                    message.reply({
                        content: `**${rolled}**`
                    })
                }else {
                    embed = new Discord.MessageEmbed()
                    .setColor(await functions.getRoleColor(guild, user.id))
                    .addFields({
                        name: '🎲:',
                        value: text,
                        inline: false
                    },
                    {
                        name: instance.messageHandler.get(guild, 'RESULTADO'),
                        value: `**${rolled}**`,
                        inline: false
                    })
                    .setFooter({text: 'by Falcão ❤️'})
                    interaction.reply({
                        embeds: [embed]
                    })
                }
            }
        } catch(error) {
            console.error(`roll: ${error}`)
        }
    }
}