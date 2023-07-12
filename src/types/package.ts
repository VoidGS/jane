interface EncomendaEndereco {
	cidade: string
	uf: string
	bairro?: string
	cep?: string
	logradouro?: string
	numero?: string
}

interface EncomendaUnidade {
	endereco: EncomendaEndereco | {}
	nome?: string
	tipo: string
}

interface EncomendaEventos {
	codigo: string
	descricao: string
	detalhe?: string
	dtHrCriado: string
	tipo: string
	unidade: EncomendaUnidade
	unidadeDestino?: EncomendaUnidade
	urlIcone: string
}

interface EncomendaTipoPostal {
	categoria: string
	descricao: string
	sigla: string
}

export interface Encomenda {
	codObjeto: string
	eventos: EncomendaEventos[]
	modalidade: string
	tipoPostal: EncomendaTipoPostal
	habilitaAutoDeclaracao: boolean
	permiteEncargoImportacao: boolean
	habilitaPercorridaCarteiro: boolean
	bloqueioObjeto: boolean
	possuiLocker: boolean
	habilitaLocker: boolean
	habilitaCrowdshipping: boolean
}

export interface EncomendaInvalida {
	codObjeto: string
	mensagem: string
}

export function isEncomenda(obj: any): obj is Encomenda {
	return obj && typeof obj.modalidade === 'string'
}

export function isEncomendaInvalida(obj: any): obj is EncomendaInvalida {
	return obj && typeof obj.mensagem === 'string' && typeof obj.eventos === 'undefined'
}
