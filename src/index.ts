import { ExtendedClient } from './structs/ExtendedClient'
import config from './config.json'

export * from 'colors'

const client = new ExtendedClient()

client.start()

export { client, config }
