const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")
const builder = require("../utils/snake-builder.js")
const { testOnly } = require("../config.json")
const { Falbot } = require("../../index.js")

module.exports = {
	description: "Play a game of snake",
	slash: true,
	guildOnly: true,
	testOnly,
	callback: async ({ guild, interaction, user }) => {
		try {
			await interaction.deferReply()
			const author = user
			const game = new builder.Game()

			const embed = new MessageEmbed()
				.setTitle(":snake:")
				.addFields(
					{
						name: "\u200b",
						value: game.world2string(game.world, game.snake),
					},
					{
						name: `\u200b`,
						value: `:alarm_clock: ${game.time}s\n\n${Falbot.getMessage(
							guild,
							"SCORE"
						)}: ${game.snake.length}`,
					}
				)
				.setFooter({ text: "by Falcão ❤️" })
				.setColor("PURPLE")

			const row = new MessageActionRow()
			row.addComponents([
				(up = new MessageButton()
					.setCustomId("up")
					.setEmoji("⬆️")
					.setStyle("SECONDARY")),
				(left = new MessageButton()
					.setCustomId("left")
					.setEmoji("⬅️")
					.setStyle("SECONDARY")),
				(right = new MessageButton()
					.setCustomId("right")
					.setEmoji("➡️")
					.setStyle("SECONDARY")),
				(down = new MessageButton()
					.setCustomId("down")
					.setEmoji("⬇️")
					.setStyle("SECONDARY")),
			])

			var answer = await interaction.editReply({
				embeds: [embed],
				components: [row],
				fetchReply: true,
			})

			const filter = (btInt) => {
				return btInt.user.id === author.id
			}

			const collector = answer.createMessageComponentCollector({
				filter,
				time: 1000 * 60 * 60,
			})

			var myTimer = setInterval(async function () {
				if (game.time <= 0) {
					game.snakeMovement(game.snake, game.Sd)
					game.time = 30
				}

				embed.fields[0] = {
					name: "\u200b",
					value: game.world2string(game.world, game.snake),
				}
				embed.fields[1] = {
					name: `\u200b`,
					value: `:alarm_clock: ${game.time}s\n\n${Falbot.getMessage(
						guild,
						"SCORE"
					)}: ${game.snake.length}`,
				}

				await interaction.editReply({
					embeds: [embed],
				})
				game.time -= 5
			}, 1000 * 5)

			collector.on("collect", async (i) => {
				if (i.customId === "up") {
					game.snakeMovement(game.snake, "N")
				} else if (i.customId === "left") {
					game.snakeMovement(game.snake, "W")
				} else if (i.customId === "right") {
					game.snakeMovement(game.snake, "E")
				} else if (i.customId === "down") {
					game.snakeMovement(game.snake, "S")
				}

				embed.fields[0] = {
					name: "\u200b",
					value: game.world2string(game.world, game.snake),
				}
				embed.fields[1] = {
					name: `\u200b`,
					value: `:alarm_clock: ${game.time}s\n\n${Falbot.getMessage(
						guild,
						"SCORE"
					)}: ${game.snake.length}`,
				}

				await i.update({
					embeds: [embed],
					components: [row],
				})

				if (game.gameEnded) {
					up.setDisabled(true)
					left.setDisabled(true)
					right.setDisabled(true)
					down.setDisabled(true)
					clearInterval(myTimer)
					collector.stop()

					await interaction.editReply({
						embeds: [embed],
						components: [row],
					})
				}
			})
		} catch (error) {
			console.error(`snake: ${error}`)
		}
	},
}
