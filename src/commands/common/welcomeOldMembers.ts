import { ApplicationCommandType, AttachmentBuilder } from 'discord.js'
import Canvas, { GlobalFonts } from '@napi-rs/canvas'
import { Command } from '../../structs/@types/Command'

export default new Command({
	name: 'welcome',
	description: 'Welcome the members that were on the guild before the bot came',
	type: ApplicationCommandType.ChatInput,
	async run({ interaction }) {
		const { guild } = interaction

		const members = await guild?.members.fetch()
		const filteredMembers = members?.filter((members) => members.joinedAt !== null)
		const sortedMembers = filteredMembers?.sort(
			(a, b) => a.joinedAt!.getTime() - b.joinedAt!.getTime(),
		)

		const membersString = sortedMembers
			?.map((member) => {
				return member.user.username
			})
			.join('\n')

		const canvas = Canvas.createCanvas(700, 250)
		const context = canvas.getContext('2d')
		GlobalFonts.registerFromPath('./public/Nunito-Regular.ttf', 'NunitoR')
		GlobalFonts.registerFromPath('./public/Nunito-Bold.ttf', 'NunitoB')
		GlobalFonts.registerFromPath('./public/Nunito-SemiBold.ttf', 'NunitoSB')
		GlobalFonts.registerFromPath('./public/Nunito-Black.ttf', 'NunitoBl')

		const background = await Canvas.loadImage('./img/welcomeBackground2.jpg')

		context.filter = 'blur(2px)'
		context.globalAlpha = 0.4
		context.drawImage(background, 0, 0, canvas.width, canvas.height)

		context.filter = 'none'
		context.globalAlpha = 1

		const memberEvent: 'join' | 'leave' = 'leave'
		const textColor = !(memberEvent === 'leave') ? '#34FF79' : '#FF4343'
		const symbol = !(memberEvent === 'leave') ? '+' : '–'
		const sumWidth = !(memberEvent === 'leave') ? 0 : 10
		const eventText = !(memberEvent === 'leave') ? 'Joined the server' : 'Left the server'

		context.font = '60px NunitoBl'
		context.fillStyle = textColor
		context.fillText(symbol, sumWidth + canvas.width / 3.2, canvas.height / 2.05)

		context.font = '50px NunitoB'
		context.fillStyle = '#EEEEEE'
		context.fillText('Void', sumWidth + 44 + canvas.width / 3.2, canvas.height / 2.08)

		context.font = '30px NunitoSB'
		context.fillStyle = textColor
		context.fillText(eventText, 8 + canvas.width / 3.2, canvas.height / 1.55)

		const avatar = await Canvas.loadImage(
			interaction.user.displayAvatarURL({ extension: 'jpg', size: 512 }),
		)

		context.beginPath()
		context.arc(125, 125, 75, 0, Math.PI * 2, true)
		context.closePath()
		context.clip()

		context.drawImage(avatar, 50, 50, 150, 150)

		const attachment = new AttachmentBuilder(await canvas.encode('png'), {
			name: 'welcome-image.png',
		})

		interaction.reply({ ephemeral: true, files: [attachment] })

		console.log(membersString)
	},
})
