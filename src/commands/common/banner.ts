import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	EmbedBuilder,
	GuildMember,
} from 'discord.js'
import { Command } from '../../structs/@types/Command'

export default new Command({
	name: 'banner',
	description: 'Display a user banner',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'target',
			description: 'Select the target member',
			type: ApplicationCommandOptionType.Mentionable,
		},
	],
	async run({ interaction }) {
		const { member, options } = interaction

		const targetMember = options.getMember('target') ?? member

		if (!(targetMember instanceof GuildMember)) {
			interaction.reply({
				ephemeral: true,
				content: 'Erro.',
			})
			return
		}

		const capa = (await targetMember.user.fetch()).bannerURL({ size: 4096 })

		if (!capa) {
			interaction.reply({
				ephemeral: true,
				content: `❌ ${targetMember} não possui um banner.`,
			})
			return
		}

		const embed = new EmbedBuilder()
			.setDescription(
				`📁 **${targetMember.nickname ?? targetMember.user.username}** banner's`,
			)
			.setColor('Blurple')
			.setImage(capa)

		interaction.reply({ embeds: [embed] })
	},
})
