import { ApplicationCommandType, AttachmentBuilder, User, time } from 'discord.js'
import Canvas, { GlobalFonts } from '@napi-rs/canvas'
import { Command } from '../../structs/@types/Command'

export default new Command({
	name: 'welcome',
	defaultMemberPermissions: ['Administrator'],
	description: 'Welcome the members that were on the guild before the bot came',
	type: ApplicationCommandType.ChatInput,
	async run({ interaction }) {
		const { guild } = interaction

		const members = await guild?.members.fetch()
		const filteredMembers = members?.filter((members) => members.joinedAt !== null)
		const sortedMembers = filteredMembers?.sort(
			(a, b) => a.joinedAt!.getTime() - b.joinedAt!.getTime(),
		)

		const membersArray = sortedMembers?.map((member) => {
			return member
		})

		await interaction.deferReply({ ephemeral: true })
		await interaction.editReply({ content: '🕘 Starting...' })

		if (membersArray) {
			for (let i = 0; i < membersArray.length; i++) {
				const member = membersArray[i]

				if (member) {
					const attachment = await generateCanva({
						user: member.user,
						eventType: 'join',
					})

					if (member.joinedAt) {
						await interaction.followUp({
							ephemeral: true,
							content: `> ${member.user} • ${time(member.joinedAt, 'f')}`,
							files: [attachment],
						})
					}
				}
			}
		}

		await interaction.editReply({ content: '✅ Done!' })
	},
})

interface GenerateCanvaProps {
	user: User
	eventType: 'join' | 'leave'
}

export async function generateCanva({ user, eventType }: GenerateCanvaProps) {
	const canvas = Canvas.createCanvas(700, 250)
	const context = canvas.getContext('2d')

	GlobalFonts.registerFromPath('./public/Nunito-Regular.ttf', 'NunitoR')
	GlobalFonts.registerFromPath('./public/Nunito-Bold.ttf', 'NunitoB')
	GlobalFonts.registerFromPath('./public/Roboto-Bold.ttf', 'RobotoB')
	GlobalFonts.registerFromPath('./public/Nunito-SemiBold.ttf', 'NunitoSB')
	GlobalFonts.registerFromPath('./public/Nunito-Black.ttf', 'NunitoBl')
	GlobalFonts.registerFromPath('./public/seguiemj.ttf', 'seguiemj')

	const background = await Canvas.loadImage('./img/welcomeBackground2.jpg')

	context.filter = 'blur(2px)'
	context.globalAlpha = 0.4

	context.drawImage(background, 0, 0, canvas.width, canvas.height)

	context.filter = 'none'
	context.globalAlpha = 1

	const textColor = eventType === 'join' ? '#34FF79' : '#FF4343'
	const symbol = eventType === 'join' ? '👋' : '🔻'
	const sumWidth = eventType === 'join' ? 0 : 5
	const eventText = eventType === 'join' ? 'Joined the server' : 'Left the server'

	context.font = '40px seguiemj'
	context.fillStyle = textColor
	context.fillText(symbol, sumWidth + canvas.width / 3.3, canvas.height / 2.15)

	context.font = 'bold 50px seguiemj'
	context.fillStyle = '#EEEEEE'
	context.fillText(`${user.username}`, 50 + canvas.width / 3.2, canvas.height / 2.08)

	context.font = '30px NunitoSB'
	context.fillStyle = textColor
	context.fillText(eventText, 8 + canvas.width / 3.2, canvas.height / 1.55)

	const avatar = await Canvas.loadImage(user.displayAvatarURL({ extension: 'jpg', size: 512 }))

	context.beginPath()
	context.arc(125, 125, 75, 0, Math.PI * 2, true)
	context.closePath()
	context.clip()

	context.drawImage(avatar, 50, 50, 150, 150)

	const attachment = new AttachmentBuilder(await canvas.encode('png'), {
		name: 'welcome-image.png',
	})

	return attachment
}
