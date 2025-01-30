export enum ConfigMenuEnum {
  CENTRAL_VENDAS = 'MNUCENTRALVENDAS',
  CENTRAL_ATENDIMENTO = 'MNUCENTRALATENDIMENTO',
  CENTRAL_CONFIGURACAO = 'NMUCENTRALCONFIGURACAO',
  GESTAO = 'MNUGESTAO',
  RELATORIOS = 'MNURELATORIOS',
  SEGURO_GERAIS = 'MNUSEGUROSGERAIS',
  SEGURO_PRESTAMISTA = 'MNUGSTPRESTAMISTA',
  SEGURADORA = 'MNUSEGURADORA',
  CENTRAL_COOPERADO = 'MNUCENTRALCOOPERADO'
}

export const HOME_ITENS_MENU = [ConfigMenuEnum.CENTRAL_VENDAS.toString(), ConfigMenuEnum.CENTRAL_COOPERADO.toString(), ConfigMenuEnum.GESTAO.toString(), ConfigMenuEnum.RELATORIOS.toString(), ConfigMenuEnum.CENTRAL_ATENDIMENTO.toString(), ConfigMenuEnum.CENTRAL_CONFIGURACAO.toString()];
export const RELATORIO_ITENS_MENU = [ConfigMenuEnum.RELATORIOS.toString(), ConfigMenuEnum.GESTAO.toString()];
export const CENTRAL_VENDAS_ITENS_MENU = [ConfigMenuEnum.GESTAO.toString(), ConfigMenuEnum.RELATORIOS.toString(), ConfigMenuEnum.CENTRAL_ATENDIMENTO.toString()];
export const DASHBOARD_SEGURADORA = [ConfigMenuEnum.CENTRAL_VENDAS.toString(), ConfigMenuEnum.CENTRAL_COOPERADO.toString()];
export const DASHBOARD_SEGUROS_GERAIS = [ConfigMenuEnum.CENTRAL_VENDAS.toString(), ConfigMenuEnum.CENTRAL_COOPERADO.toString(), ConfigMenuEnum.CENTRAL_ATENDIMENTO.toString()];

export enum RouterSeguros {
  HOME = '/',
  CENTRAL_VENDAS = '/central-vendas',
  CENTRAL_COOPERADO = '/central-cooperado',
  CENTRAL_ATENDIMENTO = '/central-atendimento',
  CENTRAL_CONFIGURACAO = '/seguradora/dashboard-seguradora',
  DASHBOARD_SEGURADORA = '/seguradora/dashboard-seguradora',  
  DASHBOARD_SEGUROS_GERAIS = '/seguros-gerais/dashboard-seguros-gerais'
}
