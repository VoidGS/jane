import { Schema, model } from 'mongoose'
import { Regions } from '../functions/RiotAPI/riot'

interface LeagueSchema {
	UserId: string
	LeagueId: string
	LeagueUuid: string
	LeagueName: string
	LeagueRegion: Regions
	CreatedAt: Date
}

const LeagueModel = model<LeagueSchema>(
	'League',
	new Schema<LeagueSchema>({
		UserId: { type: String, required: true },
		LeagueId: { type: String, required: true },
		LeagueUuid: { type: String, required: true },
		LeagueName: { type: String, required: true },
		LeagueRegion: { type: String, required: true },
		CreatedAt: { type: Date, required: true },
	}),
)

export { LeagueModel }
