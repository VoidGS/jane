import { Schema, model } from 'mongoose'

interface RegisterSchema {
	UserId: String
	GuildId: String
	CreatedAt: Date
}

const RegisterModel = model<RegisterSchema>(
	'Registers',
	new Schema<RegisterSchema>({
		UserId: { type: String, required: true },
		GuildId: { type: String, required: true },
		CreatedAt: { type: Date, required: true },
	}),
)

export { RegisterModel }
