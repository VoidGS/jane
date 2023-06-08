import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	Collection,
	EmbedBuilder,
	GuildMember,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js'
import { Command } from '../../../structs/@types/Command'
import { LeagueModel } from '../../../schemas/league'
import { RiotAPI } from '../../../functions/RiotAPI/riot'

let modalRegion: string

export default new Command({
	name: 'league',
	description: 'Main command for league utils',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'register',
			description: 'Link your league account to your profile',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'region',
					description: 'Select the region of the league account',
					required: true,
					type: ApplicationCommandOptionType.String,
					choices: [
						{ name: 'Brazil', value: 'br1' },
						{ name: 'Europe Nordic & East', value: 'eun1' },
						{ name: 'Europe West', value: 'euw1' },
						{ name: 'Japan', value: 'jp1' },
						{ name: 'Republic of Korea', value: 'kr' },
						{ name: 'Latin America North', value: 'la1' },
						{ name: 'Latin America South', value: 'la2' },
						{ name: 'North America', value: 'na1' },
						{ name: 'Oceania', value: 'oc1' },
						{ name: 'The Philippines', value: 'ph2' },
						{ name: 'Russia', value: 'ru' },
						{ name: 'Singapore, Malaysia, & Indonesia', value: 'sg2' },
						{ name: 'Thailand', value: 'th2' },
						{ name: 'Turkey', value: 'tr1' },
						{ name: 'Taiwan, Hong Kong, and Macao', value: 'tw2' },
						{ name: 'Vietnam', value: 'vn2' },
					],
				},
			],
		},
		{
			name: 'profile',
			description: 'Display your league account details (needs to be linked)',
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: 'search',
			description: 'Search an league account details by nickname',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'region',
					description: 'Select the region of the league account',
					required: true,
					type: ApplicationCommandOptionType.String,
					choices: [
						{ name: 'Brazil', value: 'br1' },
						{ name: 'Europe Nordic & East', value: 'eun1' },
						{ name: 'Europe West', value: 'euw1' },
						{ name: 'Japan', value: 'jp1' },
						{ name: 'Republic of Korea', value: 'kr' },
						{ name: 'Latin America North', value: 'la1' },
						{ name: 'Latin America South', value: 'la2' },
						{ name: 'North America', value: 'na1' },
						{ name: 'Oceania', value: 'oc1' },
						{ name: 'The Philippines', value: 'ph2' },
						{ name: 'Russia', value: 'ru' },
						{ name: 'Singapore, Malaysia, & Indonesia', value: 'sg2' },
						{ name: 'Thailand', value: 'th2' },
						{ name: 'Turkey', value: 'tr1' },
						{ name: 'Taiwan, Hong Kong, and Macao', value: 'tw2' },
						{ name: 'Vietnam', value: 'vn2' },
					],
				},
				{
					name: 'summonername',
					description: 'League account nickname',
					required: true,
					type: ApplicationCommandOptionType.String,
				},
			],
		},
	],
	async run({ interaction, options, client }) {
		const { member } = interaction
		const subCommand = options.getSubcommand()

		if (!(member instanceof GuildMember)) return

		switch (subCommand) {
			case 'register': {
				modalRegion = options.getString('region', true)

				const modal = new ModalBuilder({
					customId: 'league-link-modal',
					title: 'Link your league account',
				})

				const accountInput = new ActionRowBuilder<TextInputBuilder>({
					components: [
						new TextInputBuilder({
							customId: 'league-link-account-input',
							label: 'Account',
							placeholder: 'Your league nickname',
							style: TextInputStyle.Short,
						}),
					],
				})

				modal.addComponents(accountInput)

				interaction.showModal(modal)

				break
			}

			case 'profile': {
				await interaction.deferReply()

				const foundAccount = await LeagueModel.findOne({
					UserId: member.user.id,
				})

				if (!foundAccount)
					return await interaction.editReply({
						content:
							'> ❌ You need to link your league account first. (**/league register**)',
					})

				const riot = new RiotAPI(foundAccount.LeagueRegion)

				const accountDetails = await riot.getSummonerDetailsById(foundAccount.LeagueId)
				if (!accountDetails) return
				const rankedData: Array<any> = accountDetails.rankedData

				let soloQueueData = { tier: 'UNRANKED', rank: '' }
				let flexQueueData = { tier: 'UNRANKED', rank: '' }
				if (rankedData.length > 0) {
					soloQueueData =
						rankedData.find((q) => q.queueType === 'RANKED_SOLO_5x5') ?? soloQueueData
					flexQueueData =
						rankedData.find((q) => q.queueType === 'RANKED_FLEX_SR') ?? flexQueueData
				}

				const dEmoji = client.emojis.cache.get('1111708599115321365')
				if (!dEmoji) return

				const embed = new EmbedBuilder()
					.setDescription(
						`
							📁  **League Profile**\n \u200B
						`,
					)
					.addFields(
						{
							name: 'Summoner name',
							value: '**```' + accountDetails.name + '```**',
							inline: true,
						},
						{
							name: 'Summoner level',
							value: '**```' + accountDetails.summonerLevel + '```**',
							inline: true,
						},
						{
							name: '\u200B',
							value: `${dEmoji}${dEmoji}${dEmoji}${dEmoji}${dEmoji} **RANKED** ${dEmoji}${dEmoji}${dEmoji}${dEmoji}${dEmoji} \n \u200B`,
						},
						{
							name: 'Solo/Duo Elo',
							value:
								'**```' + soloQueueData.tier + ' ' + soloQueueData.rank + '```**',
							inline: true,
						},
						{
							name: 'Flex Elo',
							value:
								'**```' + flexQueueData.tier + ' ' + flexQueueData.rank + '```**',
							inline: true,
						},
					)
					.setColor('#3E3AF5')
					.setThumbnail(accountDetails.profileIconUrl)
					.setFooter({ text: member.user.username, iconURL: member.displayAvatarURL() })
					.setTimestamp()

				await interaction.editReply({ embeds: [embed] })

				break
			}

			case 'search': {
				const summonerName = options.getString('summonername', true)
				const region = options.getString('region', true)

				await interaction.deferReply()

				const riot = new RiotAPI(region)

				const accountResponse = await riot.getSummonerByName(summonerName)
				if (!accountResponse) return
				const accountData = accountResponse.data

				const accountDetails = await riot.getSummonerDetailsById(accountData.id)
				if (!accountDetails) return
				const rankedData: Array<any> = accountDetails.rankedData

				let soloQueueData = { tier: 'UNRANKED', rank: '' }
				let flexQueueData = { tier: 'UNRANKED', rank: '' }
				if (rankedData.length > 0) {
					soloQueueData =
						rankedData.find((q) => q.queueType === 'RANKED_SOLO_5x5') ?? soloQueueData
					flexQueueData =
						rankedData.find((q) => q.queueType === 'RANKED_FLEX_SR') ?? flexQueueData
				}

				const dEmoji = client.emojis.cache.get('1111708599115321365')
				if (!dEmoji) return

				const embed = new EmbedBuilder()
					.setDescription(
						`
							📁  **League Profile**\n \u200B
						`,
					)
					.addFields(
						{
							name: 'Summoner name',
							value: '**```' + accountDetails.name + '```**',
							inline: true,
						},
						{
							name: 'Summoner level',
							value: '**```' + accountDetails.summonerLevel + '```**',
							inline: true,
						},
						{
							name: '\u200B',
							value: `${dEmoji}${dEmoji}${dEmoji}${dEmoji}${dEmoji} **RANKED** ${dEmoji}${dEmoji}${dEmoji}${dEmoji}${dEmoji} \n \u200B`,
						},
						{
							name: 'Solo/Duo Elo',
							value:
								'**```' + soloQueueData.tier + ' ' + soloQueueData.rank + '```**',
							inline: true,
						},
						{
							name: 'Flex Elo',
							value:
								'**```' + flexQueueData.tier + ' ' + flexQueueData.rank + '```**',
							inline: true,
						},
					)
					.setColor('#3E3AF5')
					.setThumbnail(accountDetails.profileIconUrl)
					.setFooter({ text: member.user.username, iconURL: member.displayAvatarURL() })
					.setTimestamp()

				await interaction.editReply({ embeds: [embed] })

				break
			}

			default: {
				break
			}
		}
	},
	modals: new Collection([
		[
			'league-link-modal',
			async (modalInteracion) => {
				const { member, fields, guild } = modalInteracion

				if (!guild) return
				if (!(member instanceof GuildMember)) return
				if (!modalRegion) return

				await modalInteracion.deferReply({ ephemeral: true })

				const accountName = fields.getTextInputValue('league-link-account-input')

				const foundAccount = await LeagueModel.findOne({
					UserId: member.user.id,
				})

				if (foundAccount) {
					await modalInteracion.editReply({
						content:
							"> ❌ **There's aleready an league account linked to your profile.**",
					})
				} else {
					const riot = new RiotAPI(modalRegion)

					const accountRequest = await riot.getSummonerByName(accountName)

					if (!accountRequest) return
					if (accountRequest.status !== 200) {
						switch (accountRequest.status) {
							case 404: {
								await modalInteracion.editReply({
									content: `> ❌ League account not found. **${accountName} (${modalRegion})**`,
								})
								return
							}

							default: {
								break
							}
						}
					}

					try {
						const insertAccount = await LeagueModel.insertMany([
							{
								UserId: member.user.id,
								LeagueName: accountName,
								LeagueId: accountRequest.data.id,
								LeagueUuid: accountRequest.data.puuid,
								LeagueRegion: modalRegion,
								CreatedAt: new Date(),
							},
						])

						if (!insertAccount) return

						const checkmarkEmoji = guild.emojis.cache.get('1094475021956677723')

						await modalInteracion.editReply({
							content: `> ${checkmarkEmoji} **Account linked!**`,
						})
					} catch (error) {
						console.log(error)
						await modalInteracion.editReply({
							content: '❌ An error occurred.',
						})
					}
				}
			},
		],
	]),
})
