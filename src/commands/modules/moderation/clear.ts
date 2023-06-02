import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	EmbedBuilder,
	GuildMember,
} from 'discord.js'
import { Command } from '../../../structs/@types/Command'

export default new Command({
	name: 'clear',
	description: 'Cleans messages from a channel.',
	defaultMemberPermissions: ['Administrator'],
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'quantity',
			description: 'Choose the quantity of messages to be cleared.',
			type: ApplicationCommandOptionType.Number,
			required: true,
		},
		{
			name: 'user',
			description: 'Filter by user messages.',
			type: ApplicationCommandOptionType.User,
			required: false,
		},
	],
	async run({ interaction }) {
		if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return

		const { channel, options } = interaction

		await interaction.deferReply({ ephemeral: true })

		if (!channel) {
			await interaction.editReply({ content: 'This channel is invalid' })
			return
		}

		const amount = options.getNumber('quantity')
		const targetUser = options.getUser('user') as GuildMember | null

		if (!amount) {
			await interaction.editReply({ content: 'Invalid amount' })
			return
		}

		let messages = await channel.messages.fetch()
		let filterUsed = 'No filter used'

		if (targetUser) {
			messages = messages.filter((m) => m.author.id === targetUser?.id)

			if (messages.size < 1) {
				await interaction.editReply({ content: 'No message found' })
				return
			}

			filterUsed = `Filtered by: ${targetUser}`
		}

		await channel
			.bulkDelete(messages.first(amount), true)
			.then(async (cleared) => {
				await interaction.editReply({
					content: `Cleared ${cleared.size} messages in ${channel}`,
				})

				const embed = new EmbedBuilder()
					.setDescription(
						'**🧹 Messages cleared** \n\n **```' +
							cleared.size +
							'```** \n > ' +
							filterUsed,
					)
					.setColor('#F5CB3A')

				await channel.send({ embeds: [embed] })
			})
			.catch(async (err) => {
				await interaction.editReply({ content: `An error occured` })
				console.log(err)
			})
	},
})
