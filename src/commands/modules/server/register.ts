import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ButtonBuilder,
	ButtonStyle,
	Collection,
	EmbedBuilder,
	GuildMember,
	Role,
	TextChannel,
} from 'discord.js'
import { Command } from '../../../structs/@types/Command'
import { MemberModel } from '../../../schemas/members'
import { GuildModel } from '../../../schemas/guilds'

export default new Command({
	name: 'register',
	defaultMemberPermissions: ['Administrator'],
	description: 'Setup the register message',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'channel',
			description: 'Choose the channel to send the register',
			type: ApplicationCommandOptionType.Channel,
			required: true,
		},
		{
			name: 'role',
			description: 'Choose the role the registered member will receive',
			type: ApplicationCommandOptionType.Role,
			required: true,
		},
	],
	async run({ interaction }) {
		if (!interaction.isChatInputCommand()) return

		const { options, guild } = interaction

		await interaction.deferReply({ ephemeral: true })

		const registerChannel = options.getChannel('channel', true)
		const registerRole = options.getRole('role', true)

		if (!(registerChannel instanceof TextChannel))
			return await interaction.editReply({
				content: `❌ O canal ${registerChannel} não é válido`,
			})
		if (!(registerRole instanceof Role))
			return await interaction.editReply({
				content: `❌ O cargo ${registerRole} não é válido`,
			})

		const silhouetteEmoji = guild?.emojis.cache.get('1031635897319444480')

		const embed = new EmbedBuilder()
			.setTitle(`╭──── ${silhouetteEmoji} ☆ Registro ›`)
			.setDescription(
				`Seja bem-vindo ao servidor **${guild?.name}** \n\n > Preencha todos os dados para que possamos registrar você.`,
			)
			.setColor('#101010')
			.setThumbnail(guild!.iconURL({ size: 512 }))

		const registerButton = new ButtonBuilder({
			customId: 'register-button',
			label: 'Registre-se',
			emoji: '🦇',
			style: ButtonStyle.Secondary,
		})

		const componentsRow = new ActionRowBuilder<ButtonBuilder>({
			components: [registerButton],
		})

		const foundGuild = await GuildModel.findOne({ GuildId: guild!.id })

		if (!foundGuild) {
			try {
				await GuildModel.insertMany([
					{
						GuildId: guild!.id,
						GuildName: guild!.name,
						RegisteredRoleId: registerRole.id,
						GuildCreatedAt: guild!.createdAt,
						CreatedAt: new Date(),
					},
				])
			} catch (error) {
				await interaction.editReply({ content: '❌ Ocorreu um erro.' })
				console.log(error)
			}
		}

		await registerChannel.send({ embeds: [embed], components: [componentsRow] })

		await interaction.editReply({ content: '✅ Done!' })
	},
	buttons: new Collection([
		[
			'register-button',
			async (buttonInteraction) => {
				const { user, guild, member } = buttonInteraction

				if (!guild) return
				if (!(member instanceof GuildMember)) return

				await buttonInteraction.deferReply({ ephemeral: true })

				const foundUser = await MemberModel.findOne({
					UserId: user.id,
					GuildId: guild.id,
				})

				if (!foundUser) {
					const foundGuild = await GuildModel.findOne({
						GuildId: guild.id,
					})

					if (!foundGuild) return

					const registerRoleId = foundGuild.RegisteredRoleId

					if (!registerRoleId) return

					const registerRole = guild.roles.cache.get(registerRoleId)

					if (!registerRole) return

					try {
						const insertUser = await MemberModel.insertMany([
							{ UserId: user.id, GuildId: guild.id, CreatedAt: new Date() },
						])

						if (!insertUser) return

						await member.roles.add(registerRole)

						const checkmarkEmoji = guild.emojis.cache.get('1094475021956677723')

						if (member.roles.cache.find((role) => role.id === registerRoleId))
							await buttonInteraction.editReply({
								content: `${checkmarkEmoji} Registro concluído com sucesso!`,
							})
					} catch (error) {
						console.log(error)
					}
				} else {
					await buttonInteraction.editReply({
						content: `❌ Você já está registrado nesse servidor!`,
					})
				}
			},
		],
	]),
})
