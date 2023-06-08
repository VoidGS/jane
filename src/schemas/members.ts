import { Schema, model } from 'mongoose'

interface MemberSchema {
	UserId: String
	GuildId: String
	CreatedAt: Date
}

const MemberModel = model<MemberSchema>(
	'Members',
	new Schema<MemberSchema>({
		UserId: { type: String, required: true },
		GuildId: { type: String, required: true },
		CreatedAt: { type: Date, required: true },
	}),
)

export { MemberModel }
