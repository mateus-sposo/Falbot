const {Constants} = require('discord.js')
const {explain} = require('../utils/functions.js')
const {testOnly} = require("../config.json")

module.exports =  {
    aliases: ['ajuda', 'comandos', 'help'],
    category: 'uteis',
    description: 'Show all commands or info about a specific command',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    options: [
        {
            name: 'command',
            description: 'the command you want to get info about, leave blank to see all commands',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    testOnly,
    callback: async ({args, instance, guild}) => {
        try {
            return await explain(instance, guild, args[0] || '')
        } catch (error) {
            console.error(`Comandos: ${error}`)
        }
    }
}