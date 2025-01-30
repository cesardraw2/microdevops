export interface DetalheFaturaResponse {
  'resultado': {
    'id': number;
    'idInstituicao': number;
    'usuarioSolicitacao': string;
    'versao': number;
    'mes': number;
    'ano': number;
    'nomeArquivo': string;
    'ultimaEtapa': {
      'id': number;
      'dataHoraGravacao': number;
      'observacoes': string;
      'status': string;
      'documentos': Array<DocumentoFaturaResponse>
    },
    'etapaAtual': {
      'id': number;
      'dataHoraGravacao': number;
      'observacoes': string;
      'status': string;
      'documentos': Array<DocumentoFaturaResponse>
    }
  };
}

export interface DocumentoFaturaResponse {
  'id': number;
  'idDocumentoGED': number;
  'usuarioGravacao': string;
  'documentoInicial': boolean;
  'tipoDocumento': string;
}
