import {InstituicaoModel} from '@app/models/instituicao.model';

export interface ConsultaRelatorioPlurianualModel {
  /**
   * idCooperativa = id da instituição
   */
  idCooperativas?: Array<number>;
  idCooperativa?: number;
  idCentral?: number;
  pa: number;
  dataInicio: Date;
  dataFim: Date;
  situacao?: string;
  pagina: number;
  tamanhoPagina: number;
  central?: boolean;
  isGerarRelatorio?: boolean,
  cooperativas?: Array<InstituicaoModel>;
}
