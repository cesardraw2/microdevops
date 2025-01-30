export enum StatusEnum {
  PENDENTE_ENVIO = 'PENDENTE_ENVIO',
  ENVIADO = 'ENVIADO',
  ENCAMINHADA_ANALISE = 'ENCAMINHADA_ANALISE',
  ENCAMINHADO_PAGAMENTO = 'ENCAMINHADO_PAGAMENTO',
  CANCELADO = 'CANCELADO',
  CONCLUIDO = 'CONCLUIDO',
  ENCAMINHADO_SOLICITANTE = 'ENCAMINHADO_SOLICITANTE'
}

export function getLabel(etapa: StatusEnum): string {
  switch (etapa) {
    case StatusEnum.PENDENTE_ENVIO:
      return 'Pendente de envio';
    case StatusEnum.ENVIADO:
      return 'Iniciada';
    case StatusEnum.CONCLUIDO:
      return 'Concluída';
    case StatusEnum.ENCAMINHADA_ANALISE:
      return 'Em análise';
    case StatusEnum.ENCAMINHADO_SOLICITANTE:
      return 'Encaminhar ao Solicitante';
    case StatusEnum.CANCELADO:
      return 'Cancelada';
    case StatusEnum.ENCAMINHADO_PAGAMENTO:
      return 'Encaminhada para pagamento';
  }

}
