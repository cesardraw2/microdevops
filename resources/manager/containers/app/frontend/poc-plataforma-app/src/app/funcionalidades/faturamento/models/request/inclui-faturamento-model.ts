import {DocumentoFaturamentoModel} from '@funcionalidades/faturamento/models/request/documento-faturamento.model';

export interface IncluiFaturamentoModel {
  idInstituicao: number;
  idUnidadeInst: number;
  mes: number;
  ano: number;
  nomeArquivoNAS: string;
  documentos: Array<DocumentoFaturamentoModel>;
}
