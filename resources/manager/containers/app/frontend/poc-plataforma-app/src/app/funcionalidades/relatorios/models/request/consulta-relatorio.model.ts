import { InstituicaoModel } from "@app/models/instituicao.model";

export interface ConsultaRelatorioModel {
  cooperativa: number;
  central: number;
  instituicao: number;
  produto: string;
  situacaoProposta: string;
  dataInicio: Date;
  dataFim: Date;
  pa: string;
  cpfCnpj: string;
  canal: string;
  pagina: number;
  tamanhoPagina: number;
  cooperativas: Array<InstituicaoModel>;
}
