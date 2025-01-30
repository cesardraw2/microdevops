export interface PessoaModel {
  idPessoa?: number;
  cpfCnpj?: string;
  nomePessoa?: string;
  nomeSocial?: string;
  codTipoPessoa?: number;
  codigoCompartilhamentoCadastro?: number;
  nomeCompleto?: string;
  nomeApelido?: string;
  descricaoObservacaoPessoa?: string;
  codigoAtividadeEconomica?: number;
  descricaoAtividadeEconomica?: string;
  codigoCnaeFiscal?: string;
  descricaoCnaeFiscal?: string;
  dataInclusaoSistema?: number;
  autorizaConsultaBacen?: boolean;
  dataInclusaoSFN?: number;
  idPessoaLegado?: number;
  idInstituicao?: number;
  dataRenovacaoCadastral?: number;
  idUsuarioRenovacao?: string;
  idInstituicaoRenovacao?: number;
  idUnidadeInst?: number;
}
const pessoaModel: Partial<PessoaModel> = {};
