import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	EmbedBuilder,
	GuildEmoji,
} from 'discord.js'
import { Command } from '../../../structs/@types/Command'
import { rastrearEncomendas } from 'correios-brasil'
import { Encomenda, EncomendaInvalida, isEncomendaInvalida } from '../../../types/package'

export default new Command({
	name: 'package',
	description: 'Main command for package management.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'track',
			description: 'Track a package.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'tracking-code',
					description: 'The tracking code of the package.',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
	],
	async run({ interaction, options, client }) {
		const subCommand = options.getSubcommand()

		switch (subCommand) {
			case 'track': {
				const trackingCode = options.getString('tracking-code', true)

				await interaction.deferReply()

				rastrearEncomendas([trackingCode])
					.then(async (response: Encomenda[] | EncomendaInvalida[]) => {
						response.forEach(async (encomenda) => {
							if (isEncomendaInvalida(encomenda)) {
								const { mensagem } = encomenda

								return await interaction.editReply({
									content: `❌ ${mensagem}`,
								})
							}

							const { codObjeto, eventos } = encomenda
							const eventosEmbed: string[] = []
							const correiosGuild = client.guilds.cache.get('1128747768354197624')
							if (!correiosGuild) {
								return await interaction.editReply({
									content: '❌ Ocorreu um erro.',
								})
							}

							eventos.forEach(async (evento) => {
								console.log(evento)

								const { descricao, dtHrCriado, unidade, unidadeDestino, urlIcone } =
									evento
								const { endereco, tipo, nome } = unidade
								let correioEmoji: GuildEmoji | undefined
								const getEmoji = urlIcone.split('/')
								const emojiName = getEmoji.pop()?.replace('.png', '')

								if (emojiName) {
									const findEmoji = correiosGuild.emojis.cache.find(
										(emoji) => emoji.name === emojiName.replaceAll('-', ''),
									)

									if (!findEmoji) {
										const emojiImg = `https://rastreamento.correios.com.br/static/rastreamento-internet/imgs/${emojiName}.png`

										correioEmoji = await correiosGuild.emojis.create({
											attachment: emojiImg,
											name: emojiName.replaceAll('-', ''),
										})
									} else {
										correioEmoji = findEmoji
									}
								} else {
									correioEmoji = undefined
								}

								eventosEmbed.push(`
									> **${correioEmoji} ${correioEmoji ? ' - ' : ''} ${descricao}**
									> ${unidade.tipo} ${unidadeDestino ? '→ ' + unidadeDestino.tipo : ''}
									> ${dtHrCriado} 
								`)
							})

							const embed = new EmbedBuilder()
								.setDescription(
									`
									**Package Track - ${codObjeto}**
									${eventosEmbed.join(' ')}
								`,
								)
								.setColor('#F3C902')

							return await interaction.editReply({
								embeds: [embed],
							})
						})
					})
					.catch((err) => {
						console.log(`${err}`.red)
					})

				break
			}

			default: {
				break
			}
		}
	},
})
