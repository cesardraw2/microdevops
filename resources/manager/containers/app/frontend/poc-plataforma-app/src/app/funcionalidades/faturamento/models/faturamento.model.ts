import {StatusFaturamentoEnum} from '@funcionalidades/faturamento/enums/status-faturamento.enum';

export interface Faturamento {
  id?: number;
  cooperativa: string;
  cnpjSeguradora: string;
  razaoSocial: string;
  dataSolicitacao: string;
  versao: string;
  status: StatusFaturamentoEnum;
}
