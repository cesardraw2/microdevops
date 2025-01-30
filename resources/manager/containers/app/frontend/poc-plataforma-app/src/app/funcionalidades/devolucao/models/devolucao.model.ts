import { DadosArquivo } from "@app/shared/services/base64.service";

export class Devolucao {
  public id: string;
  public central: string;
  public cooperativa: string;
  public cpfCnpj: string;
  public nomeRazaoSocial: string;
  public numeroContrato: string;
  public produto: string;
  public dataUltimaSituacao: Date;
  public status: string;
  public dataInicial: Date;
  public dataFinal: Date;
  public tipoConta: string;
  public numeroContaCorrenteCooperativa: string;
  public numeroContaCorrente: string;
  public justificativa: string;
  public arquivos: Array<DadosArquivo>;
}
