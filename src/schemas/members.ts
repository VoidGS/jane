import { Schema, model } from 'mongoose'

interface UserSchema {
	UserId: String
	UserName: String
	GuildId: String
	CreatedAt: Date
}

const UserModel = model<UserSchema>(
	'Users',
	new Schema<UserSchema>({
		UserId: { type: String, required: true },
		UserName: { type: String, required: true },
		GuildId: { type: String, required: true },
		CreatedAt: { type: Date, required: true },
	}),
)

export { UserModel }
