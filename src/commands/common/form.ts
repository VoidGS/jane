import {
	ActionRowBuilder,
	ApplicationCommandType,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js'
import { Command } from '../../structs/@types/Command'

export default new Command({
	name: 'form',
	description: 'Open a form modal',
	type: ApplicationCommandType.ChatInput,
	async run({ interaction }) {
		const modal = new ModalBuilder({
			customId: 'staff-form-modal',
			title: 'Formulário para staff',
		})

		const input1 = new ActionRowBuilder<TextInputBuilder>({
			components: [
				new TextInputBuilder({
					customId: 'staff-form-modal-input',
					label: 'Nome',
					placeholder: 'Digite seu nome',
					style: TextInputStyle.Short,
				}),
			],
		})

		const input2 = new ActionRowBuilder<TextInputBuilder>({
			components: [
				new TextInputBuilder({
					customId: 'staff-form-age-input',
					label: 'Idade',
					placeholder: 'Digite sua idade',
					style: TextInputStyle.Short,
				}),
			],
		})

		const input3 = new ActionRowBuilder<TextInputBuilder>({
			components: [
				new TextInputBuilder({
					customId: 'staff-form-about-input',
					label: 'Sobre você',
					placeholder: 'Escreva sobre você',
					style: TextInputStyle.Paragraph,
				}),
			],
		})

		modal.addComponents(input1, input2, input3)

		interaction.showModal(modal)
	},
})
