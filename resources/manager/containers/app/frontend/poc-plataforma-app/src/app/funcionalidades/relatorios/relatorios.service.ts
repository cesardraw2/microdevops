import { Injectable } from '@angular/core';
import { Proposta } from './models/proposta.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { BaseService } from '@app/shared/services/base.service';
import { Color } from '@sicoob/ui';
import { map, catchError } from 'rxjs/operators';
import { CustomAlertService } from '@app/shared/services/alert-custom.service';
import { MsgErrorEnum } from '@app/shared/enum/message.enum';
import { Paginacao } from '../faturamento/models/paginacao.model';
import { ConsultaRelatorioModel } from './models/request/consulta-relatorio.model';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService  extends BaseService {

  constructor(private http: HttpClient,
    customAlertService: CustomAlertService) {
    super(customAlertService);
  }


  consultaProposta(objConsulta: ConsultaRelatorioModel, pagina: number) {
    return this.http.get<any[]>(`${environment.REST_URL}/seguro-vida/v1/propostas`,
    {
      ...this.httpOptions, params: <any>{
        idInstituicao: objConsulta.instituicao,
        central: objConsulta.central ? objConsulta.central : 0,
        pa: objConsulta.pa ? objConsulta.pa : 0,
        produto: objConsulta.produto ? objConsulta.produto : '',
        situacao: objConsulta.situacaoProposta ? objConsulta.situacaoProposta : '',
        canalContratacao: objConsulta.canal ? objConsulta.canal : '',
        cpfCnpj: objConsulta.cpfCnpj ? objConsulta.cpfCnpj : '',
        dataInicio: objConsulta.dataInicio ? objConsulta.dataInicio : '',
        dataFim: objConsulta.dataFim ? objConsulta.dataFim : '',
        cooperativas: objConsulta.cooperativas,
        pagina: pagina ? pagina : 0
      }
    }
    )
    .pipe(
      map((resposta: any) => {
        if (resposta.resultado.lista.length > 0) {
          return {
            propostas: resposta.resultado.lista.map(resp => {
              return <Proposta>{
                proposta: resp.proposta,
                idPessoa: resp.idPessoa,
                produto: resp.produto,
                cpfCnpj: resp.cpfCnpj,
                nomePessoa: resp.nomePessoa,
                canalContratacao: resp.canalContratacao,
                dataSituacao: resp.dataSituacao,
                situacao: resp.situacao,
                cooperativa: resp.cooperativa,
              };
            }),
            paginacao: <Paginacao> {
              pagina: resposta.resultado.pagina,
              tamanhoPagina: resposta.resultado.tamanhoPagina,
              totalRegistros: resposta.resultado.totalRegistros
            }
          };
        }
        this.customAlertService.abrirAlert(Color.WARNING, MsgErrorEnum.RELATORIO_PROPOSTA_NAO_ENCONTRADA);
      }),
      catchError((error) => this.handleError(error)));
  }

  consultaPropostaVenda(objConsulta: ConsultaRelatorioModel, pagina: number) {
    return this.http.get<any[]>(`${environment.REST_URL}/seguro-vida/v1/propostas`,
    {
      ...this.httpOptions, params: <any>{
        idInstituicao: objConsulta.instituicao,
        central: objConsulta.central ? objConsulta.central : 0,
        pa: objConsulta.pa ? objConsulta.pa : 0,
        produto: objConsulta.produto ? objConsulta.produto : '',
        situacao: objConsulta.situacaoProposta ? objConsulta.situacaoProposta : '',
        canalContratacao: objConsulta.canal ? objConsulta.canal : '',
        cpfCnpj: objConsulta.cpfCnpj ? objConsulta.cpfCnpj : '',
        dataInicio: objConsulta.dataInicio ? objConsulta.dataInicio : '',
        dataFim: objConsulta.dataFim ? objConsulta.dataFim : '',
        pagina: pagina ? pagina : 0,
        cooperativas: objConsulta.cooperativas,
      }
    }
    )
    .pipe(
      map((resposta: any) => {
        if (resposta.resultado.lista.length > 0) {
          return {
            propostas: resposta.resultado.lista.map(resp => {
              return <Proposta>{
                proposta: resp.proposta,
                produto: resp.produto,
                situacao: resp.situacao,
                dataSituacao: resp.dataSituacao,
                idInstituicao: resp.idInstituicao,
                unidadeInst: resp.unidadeInst,
                dataVenda: resp.dataVenda,
                cpfCnpj: resp.cpfCnpj,
                nomePessoa: resp.nomePessoa,
                periodicidade: resp.periodicidade,
                valorCapitalSegurado: resp.valorCapitalSegurado,
                valorPremio: resp.valorPremio,
                valorPremioMensal: resp.valorPremioMensal,
                cpfVendedor: resp.cpfVendedor,
                nomeVendedor: resp.nomeVendedor,
                canalContratacao: resp.canalContratacao,
                dataCancelamento: resp.dataCancelamento,
                motivoCancelamento: resp.motivoCancelamento,
                cooperativa: resp.cooperativa,
                pa: resp.pa
              };
            }),
            paginacao: <Paginacao> {
              pagina: resposta.resultado.pagina,
              tamanhoPagina: resposta.resultado.tamanhoPagina,
              totalRegistros: resposta.resultado.totalRegistros
            }
          };
        }
        this.customAlertService.abrirAlert(Color.WARNING, MsgErrorEnum.RELATORIO_PROPOSTA_NAO_ENCONTRADA);
      }),
      catchError((error) => this.handleError(error)));
  }
}
