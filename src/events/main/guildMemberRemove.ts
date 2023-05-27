import { TextChannel, time } from 'discord.js'
import { Event } from '../../structs/@types/Event'
import { generateCanva } from '../../commands/manage/welcome'

export default new Event({
	name: 'guildMemberRemove',
	async run(member) {
		const welcomeChannel = member.guild.systemChannel

		if (welcomeChannel instanceof TextChannel) {
			const attachment = await generateCanva({
				user: member.user,
				eventType: 'leave',
			})

			if (member.joinedAt) {
				await welcomeChannel.send({
					content: `> ${member.user} • ${time(member.joinedAt, 'f')}`,
					files: [attachment],
				})
			}
		}
	},
})
