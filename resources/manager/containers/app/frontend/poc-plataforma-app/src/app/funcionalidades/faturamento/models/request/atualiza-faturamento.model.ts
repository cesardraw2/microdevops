import {DocumentoFaturamentoModel} from '@funcionalidades/faturamento/models/request/documento-faturamento.model';

export interface AtualizaFaturamentoModel {
  id?: number;
  idUnidadeInst: number;
  status: string;
  observacao: string;
  documentos: Array<DocumentoFaturamentoModel>;
}
