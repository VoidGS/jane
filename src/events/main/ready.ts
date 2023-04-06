import { client } from '../..'
import { Event } from '../../structs/@types/Event'

export default new Event({
	name: 'ready',
	once: true,
	run() {
		const { commands, buttons, selects, modals } = client

		console.log('✅ Bot online'.green)
		console.log(`Commands loaded: ${commands.size}`.blue)
		console.log(`Buttons loaded: ${buttons.size}`.blue)
		console.log(`Select Menus loaded: ${selects.size}`.blue)
		console.log(`Modals loaded: ${modals.size}`.blue)
	},
})
