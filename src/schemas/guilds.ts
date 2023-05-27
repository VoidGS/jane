import { Schema, model } from 'mongoose'

interface GuildSchema {
	GuildId: string
	GuildName: string
	RegisteredRoleId: string
	GuildCreatedAt: Date
	CreatedAt: Date
}

const GuildModel = model<GuildSchema>(
	'Guilds',
	new Schema<GuildSchema>({
		GuildId: { type: String, required: true },
		GuildName: { type: String, required: true },
		RegisteredRoleId: { type: String, required: true },
		GuildCreatedAt: { type: Date, required: true },
		CreatedAt: { type: Date, required: true },
	}),
)

export { GuildModel }
