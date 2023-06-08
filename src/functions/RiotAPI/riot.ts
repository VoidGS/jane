import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export type Regions =
	| 'br1'
	| 'eun1'
	| 'euw1'
	| 'jp1'
	| 'kr'
	| 'la1'
	| 'la2'
	| 'na1'
	| 'oc1'
	| 'ph2'
	| 'ru'
	| 'sg2'
	| 'th2'
	| 'tr1'
	| 'tw2'
	| 'vn2'

export class RiotAPI {
	#APIKEY
	#RIOT_URL
	#DDRAGON_URL

	constructor(region: Regions | String = 'br1') {
		this.#APIKEY = process.env.RIOT_API_KEY
		this.#RIOT_URL = `https://${region}.api.riotgames.com`
		this.#DDRAGON_URL = 'https://ddragon.leagueoflegends.com'
	}

	// Routes
	public async getSummonerByName(summonerName: string) {
		try {
			const response = await axios({
				method: 'get',
				url: `${this.#RIOT_URL}/lol/summoner/v4/summoners/by-name/${summonerName}`,
				headers: {
					'X-Riot-Token': this.#APIKEY,
				},
				validateStatus(status) {
					return status === 200 || status === 404
				},
			})

			return response
		} catch (err) {
			console.log(err)

			return null
		}
	}

	public async getSummonerById(summonerId: string) {
		try {
			const response = await axios({
				method: 'get',
				url: `${this.#RIOT_URL}/lol/summoner/v4/summoners/${summonerId}`,
				headers: {
					'X-Riot-Token': this.#APIKEY,
				},
				validateStatus(status) {
					return status === 200 || status === 404
				},
			})

			return response
		} catch (err) {
			console.log(err)
			return null
		}
	}

	public async getRankedDetailsById(summonerId: string) {
		try {
			const response = await axios({
				method: 'get',
				url: `${this.#RIOT_URL}/lol/league/v4/entries/by-summoner/${summonerId}`,
				headers: {
					'X-Riot-Token': this.#APIKEY,
				},
				validateStatus(status) {
					return status === 200 || status === 404
				},
			})

			return response
		} catch (err) {
			console.log(err)
			return null
		}
	}

	public async getPathVersion() {
		try {
			const response = await axios({
				method: 'get',
				url: `${this.#DDRAGON_URL}/api/versions.json`,
			})

			const pathData = response.data

			return { current: pathData[0], previous: pathData[1] }
		} catch (err) {
			console.log(err)
			return null
		}
	}

	public async getSummonerDetailsById(summonerId: string) {
		try {
			// Account
			const accountResponse = await this.getSummonerById(summonerId)
			if (!accountResponse) return null

			const accountData = accountResponse.data

			const pathVersion = await this.getPathVersion()
			if (!pathVersion) return null

			const profileIconUrl = `${this.#DDRAGON_URL}/cdn/${
				pathVersion.current
			}/img/profileicon/${accountData.profileIconId}.png`

			// Ranked
			const rankedResponse = await this.getRankedDetailsById(summonerId)
			if (!rankedResponse) return null

			const rankedData = rankedResponse.data

			return { profileIconUrl, rankedData, ...accountData }
		} catch (err) {
			console.log(err)
			return null
		}
	}
}
