import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	EmbedBuilder,
	GuildMember,
} from 'discord.js'
import { Command } from '../../structs/@types/Command'

export default new Command({
	name: 'avatar',
	description: 'Display a user avatar',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'target',
			description: 'Select the target member',
			type: ApplicationCommandOptionType.Mentionable,
		},
	],
	run({ interaction }) {
		const { member, options } = interaction

		const targetMember = options.getMember('target') ?? member

		if (!(targetMember instanceof GuildMember)) {
			interaction.reply({
				ephemeral: true,
				content: 'Erro.',
			})
			return
		}

		const embed = new EmbedBuilder()
			.setDescription(
				`📁 **${targetMember.nickname ?? targetMember.user.username}** avatar's`,
			)
			.setColor('Blurple')
			.setImage(targetMember.user.avatarURL({ size: 512 }))

		interaction.reply({ embeds: [embed] })
	},
})
