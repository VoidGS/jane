import { client } from '../..'
import { Event } from '../../structs/@types/Event'

export default new Event({
	name: 'ready',
	once: true,
	run() {
		const { commands } = client

		console.log('✅ Bot online'.green)
		console.log(`📁 Commands loaded: ${commands.size}`.blue)
	},
})
