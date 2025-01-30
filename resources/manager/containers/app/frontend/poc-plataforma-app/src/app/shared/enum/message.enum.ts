export enum MsgErrorEnum {
  MSG001_FATURAMENTO_SOLICITACAO_DUPLICADA = 'Atenção! Este registro de faturamento já foi realizado.',
  MSG003_FATURAMENTO_NAO_LOCALIZADO = 'Atenção! Arquivo(s) de faturamento(s) não localizado(s).',
  MSG003_CAPES_CONSULTA_PESSOA_NAO_CONTRADA = 'Pessoa não localizada',
  MSG004_CORRETORA_NAO_ENCONTRADA = 'Sua central está sem corretora vinculada.'
  + 'Entre em contato com o Sicoob Seguradora para regularização do dado.',
  MSG005_VALIDA_ACESSO_SVE='Para contratação do seguro Vida Empresarial não podem existir inconsistências de dados cadastrais. ' +
  'Favor verificar no cadastro da empresa se todos os seguintes dados estão devidamente atualizados: ',

  CONSULTA_CENTRAIS = 'Ocorreu um erro na consulta de Centrais.',
  VALIDA_VINCULO = 'Ocorreu um erro na validaηção do vínculo de uma cooperativa ',
  INSTITUICAO_NAO_ENCONTRADA = 'Instituição não encontrada ',
  CONSULTA_COOPERATIVAS = 'Ocorreu um erro na consulta das Cooperativas.',
  CONSULTA_CORRETORA = 'Ocorreu um erro na consulta da Corretora.',
  ERRO_VINCULO_CORRETORA_COOPERATIVA = 'Ocorreu um erro na inclusão do vínculo entre a corretora e a cooperativa',
  IMPRIMIR_RELATORIO_PROPOSTA_VAZIO = 'Nenhuma proposta para gerar CSV, por favor, realize uma consulta.',
  RELATORIO_PROPOSTA_NAO_ENCONTRADA = 'Nenhuma proposta foi encontrada.',
  LIMITE_SEGURO_PRESTAMISTA = 'Limite não encontrado, para o seguro prestamista.',
  MSG006_CONSULTAR_PROPOSTA_DOCUMENTO = 'Nenhum documento esta vinculado a esta proposta',
  CANCELAR_PROPOSTA_SEM_JUSTIFICATIVA = 'Favor informar o motivo do cancelamento.',
}


export enum MsgSucessoEnum {
  MSG001_DEVOLUCAO_INCLUSAO = 'A devolução foi incluída com sucesso.',
  MSG001_DEVOLUCAO_STATUS_ENVIADA = 'A devolução enviada para análise.',
  MSG001_DEVOLUCAO_STATUS_PAGAMENTO_REALIZADO = 'Foi realizado o pagamento da devolução',
  MSG001_DEVOLUCAO_STATUS_ENCAMINHADA_PAGAMENTO = 'Devolução encaminha para pagamento com Sucesso.',
  MSG001_DEVOLUCAO_STATUS_CANCELADO = 'Cancelamento realizado com Sucesso.',
  MSG001_DEVOLUCAO_STATUS_CONCLUIDO = 'Devolução concluída com Sucesso.',
  MSG001_DEVOLUCAO_STATUS_ENCAMINHADA_SOLICITANTE = 'Devolução encaminhada ao Solicitante com Sucesso.',
  MSG001_DEVOLUCAO_STATUS_ENCAMINHADA_ANALISE = 'Devolução encaminhada para análise com Sucesso.',

  MSG002_INCLUSAO_VINCULO_CORRETORA_COOPERATIVA = 'Vínculo criado com sucesso.',
  MSG002_EXCLUSAO_VINCULO_CORRETORA_COOPERATIVA = 'Vínculo excluído com sucesso.',


  MSG010_FATURAMENTO_INICIADO = 'Faturamento encaminhada para análise com Sucesso.'

}
