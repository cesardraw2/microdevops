export interface Documento {
  id: string;
  dataDocumento: Date;
  formato: string;
  grupoDocumento: string;
  qtdePaginas: number;
  tipoDocumento: string;
  nomeArquivo: string;
  indicesDocumento: string;
  pagina: Array<DadosDocumento>;
}

export interface DadosDocumento {
  dados: string;
  pagina: number;
}
