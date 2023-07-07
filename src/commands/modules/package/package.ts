import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js'
import { Command } from '../../../structs/@types/Command'
import { rastrearEncomendas } from 'correios-brasil'
import TrackingCorreios from 'tracking-correios'

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
	async run({ interaction, options }) {
		const subCommand = options.getSubcommand()

		switch (subCommand) {
			case 'track': {
				const trackingCode = options.getString('tracking-code', true)

				rastrearEncomendas([trackingCode]).then((response) => {
					console.log(response)

					if (Array.isArray(response) && response.length > 0) {
						response.forEach((item) => {
							const { codObjeto, eventos } = item

							console.log(codObjeto, eventos)
						})
					} else {
						interaction.reply({
							content: '❌ An error occurred while trying to track the package.',
							ephemeral: true,
						})
					}
				})

				// TrackingCorreios.track(trackingCode).then((response: any) => {
				// 	console.log(response)

				// 	if (Array.isArray(response) && response.length > 0) {
				// 		response.forEach((item) => {
				// 			const { numero, evento } = item

				// 			if (Array.isArray(evento) && evento.length > 0) {
				// 				evento.forEach((event) => {
				// 					const { data, hora, descricao, local } = event

				// 					console.log(data, hora, descricao, local)
				// 				})
				// 			}

				// 			console.log(numero, evento)
				// 		})
				// 	} else {
				// 		interaction.reply({
				// 			content: '❌ An error occurred while trying to track the package.',
				// 			ephemeral: true,
				// 		})
				// 	}
				// })

				break
			}

			default: {
				break
			}
		}
	},
})
