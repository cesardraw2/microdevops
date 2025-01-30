import {StatusFaturamentoEnum} from '@funcionalidades/faturamento/enums/status-faturamento.enum';

export interface ConsultaFaturamentoModel {
  cooperativa: number;
  dataInicio: Date;
  dataFim: Date;
  statusFaturamento: StatusFaturamentoEnum;
  pagina: number;
  tamanhoPagina: number;
}
