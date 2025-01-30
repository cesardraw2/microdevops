import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Faturamento} from '@funcionalidades/faturamento/models/faturamento.model';
import {environment} from '@env/environment';
import {BaseService} from '@shared/services/base.service';
import {catchError, map} from 'rxjs/operators';
import {ConsultaFaturamentoModel} from '@funcionalidades/faturamento/models/request/consulta-faturamento.model';
import {Color} from '@sicoob/ui';
import {CustomAlertService} from '@shared/services/alert-custom.service';
import {MsgErrorEnum} from '@shared/enum/message.enum';
import {ConsultaArquivosFaturamentoModel} from '@funcionalidades/faturamento/models/request/consulta-arquivos-faturamento.model';
import {DetalheFaturaResponse} from '@funcionalidades/faturamento/models/response/detalhe-fatura-response';
import {IncluiFaturamentoModel} from '@funcionalidades/faturamento/models/request/inclui-faturamento-model';
import {AtualizaFaturamentoModel} from '@funcionalidades/faturamento/models/request/atualiza-faturamento.model';
import {Paginacao} from '@funcionalidades/faturamento/models/paginacao.model';

@Injectable({
  providedIn: 'root'
})
export class FaturamentoService extends BaseService {
  private API_FATURAMENTO = `${environment.REST_URL}/seguro-prestamista/v1/faturamentos`;
  private ARQUIVO_NAS = `arquivos-faturamento`;
  private FILTRO = `pesquisar`;
  private INCLUSAO = `inclusao`;
  private INICIAR_PROCESSAMENTO = 'processar';
  private ATUALIZAR = 'atualizar';

  constructor(private http: HttpClient,
              customAlertService: CustomAlertService) {
    super(customAlertService);
  }


  consultarFaturamentos(objConsulta: ConsultaFaturamentoModel, pagina: number):
    Observable<{ faturamentos: Faturamento[], paginacao: Paginacao }> {
    return this.http.get<Faturamento[]>(`${this.API_FATURAMENTO}/${this.FILTRO}`, {
        ...this.httpOptions, params: <any>{
          idInstituicao: objConsulta.cooperativa,
          status: objConsulta.statusFaturamento,
          dataInicio: objConsulta.dataInicio.toJSON(),
          dataFim: objConsulta.dataFim.toJSON(),
          pagina: pagina ? pagina : 0
        }
      }
    ).pipe(
      map((resposta: any) => {
        if (resposta.resultado.resultado.length > 0) {
          return {
            faturamentos: resposta.resultado.resultado.map(resp => {
              return <Faturamento>{
                id: resp.idFaturamento,
                cooperativa: resp.numeroCooperativa,
                cnpjSeguradora: resp.cnpjSeguradora,
                razaoSocial: resp.razaoSocialSeguradora,
                status: resp.status,
                versao: resp.versao,
                dataSolicitacao: `${resp.mes}/${resp.ano}`
              };
            }),
            paginacao: <Paginacao>{
              pagina: resposta.resultado.pagina,
              tamanhoPagina: resposta.resultado.tamanhoPagina,
              totalRegistros: resposta.resultado.totalRegistros
            }
          };
        }
        this.customAlertService.abrirAlert(Color.WARNING, MsgErrorEnum.MSG003_FATURAMENTO_NAO_LOCALIZADO);
        return resposta.resultado.resultado;
      }),
      catchError((error) => this.handleError(error)));
  }

  /**
   * Serviço para incluir um faturamento
   * @param faturamento
   */
  incluirFaturamento(faturamento: IncluiFaturamentoModel): Observable<any> {
    return this.http.post(`${this.API_FATURAMENTO}/${this.INCLUSAO}`, JSON.stringify(faturamento), this.httpOptions)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * consulta arquivos NAS de uma instituição para um período especifico;
   * @param obj
   */
  consultaArquivoNas(obj: ConsultaArquivosFaturamentoModel): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_FATURAMENTO}/${this.ARQUIVO_NAS}`,
      {
        ...this.httpOptions,
        params: {
          idInstituicao: obj.instituicao,
          idUnidadeInst: obj.idUnidadeInst,
          mes: (obj.data.getMonth() + 1).toString(),
          ano: obj.data.getFullYear().toString()
        }
      }).pipe(
      map((resposta: any) => resposta.resultado),
      catchError((error) => this.handleError(error)
      )
    );
  }

  buscarTodosFaturamentos(): Observable<Array<Faturamento>> {
    return this.http.get<Faturamento[]>(`${environment.REST_URL}/faturamento`, this.httpOptions).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  buscarDocumentos(id: number): Observable<DetalheFaturaResponse> {
    return this.http.get<DetalheFaturaResponse>(`${this.API_FATURAMENTO}/${id}`, this.httpOptions).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  iniciarFaturamento(id: number, usuario: string): Observable<number> {
    return this.http.patch<any>(`${this.API_FATURAMENTO}/${id}/${this.INICIAR_PROCESSAMENTO}`,
      JSON.stringify({}), this.httpOptions).pipe(
      map(() => id),
      catchError((error) => this.handleError(error))
    );
  }

  atualizarFaturamento(atualizaModel: AtualizaFaturamentoModel): Observable<number> {
    return this.http.patch<any>(`${this.API_FATURAMENTO}/${this.ATUALIZAR}`, atualizaModel, this.httpOptions).pipe(
      map((resultado: any) => {
        return resultado;
      }),
      catchError((error) => this.handleError(error))
    );
  }
}
