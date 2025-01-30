export interface RelatorioPlurianualModel {
  paginacao: PaginacaoRelatorioAuto;
  resultado: Array<DadosRelatorioPlurianual>;
}

export interface DadosRelatorioPlurianual {
  dataOperacao: Date;
  operacaoCredito: number;
  prazo: number;
  proposta: number;
  segurado: string;
  cpfCnpj: string;
  boleto: string;
  valorPremio: number;
  situacao: string;
  dataPagamento: Date;
  nomeSeguradora: string;
  idInstituicao: number;
  idPa: number;
  nomePa: string;
}

export interface PaginacaoRelatorioAuto {
  totalRegistros: number;
  numeroPagina: number;
  tamanhoPagina: number;
  totalPaginas: number;
}
