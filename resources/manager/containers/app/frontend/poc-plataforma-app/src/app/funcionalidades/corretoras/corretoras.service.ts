import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InstituicaoModel } from '@app/models/instituicao.model';
import { CustomAlertService } from '@app/shared/services/alert-custom.service';
import { BaseService } from '@app/shared/services/base.service';
import { environment } from '@env/environment';
import { Color } from '@sicoob/ui';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Corretora } from '@app/models/corretora.model';
import { VinculoCorretoraCooperativa } from '@app/models/vinculoCorretoraCooperativa.model';
import { UtilsEnum } from '@app/shared/enum/Utils.enum';
import { MsgSucessoEnum } from './../../shared/enum/message.enum';
import { PaginacaoCorretora } from './containers/container-lista-corretoras/container-lista-corretoras.component';
import { Corretoras } from './models/corretoras.model';
import { InstituicaoSimples } from '@app/models/instituicaoSimples.model';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CorretorasService extends BaseService{

  RESOURCE_URL_CENTRAL = `${environment.REST_URL}/sgr/v1/instituicoes/centrais`;
  RESOURCE_URL_INSTITUICOES = `${environment.REST_URL}/sgr/v1/instituicoes`;
  RESOURCE_URL_COOPERATIVA = `${environment.REST_URL}/sgr/v1/instituicoes/singulares`;
  RESOURCE_URL_CORRETORAS = `${environment.REST_URL}/sgr/v1${environment.CORRETORAS}-seguro`;

  constructor(private http: HttpClient,
    customAlertService: CustomAlertService) {
      super(customAlertService);
    }

  public obterListaCorretoras(nome: string, numeroSusep : string, pagina: number): Observable<{lista: Corretoras[], paginacao: PaginacaoCorretora}> {
    let queryParams = new HttpParams();
    if (nome != undefined && nome !== null && nome !== "") queryParams =  queryParams.append("nome", nome);
    if (numeroSusep != undefined && numeroSusep !== null && numeroSusep !== "") queryParams =  queryParams.append("numeroSusep", numeroSusep);
    if (pagina != undefined && pagina !== null) queryParams =  queryParams.append("pagina", pagina.toString());
    queryParams =  queryParams.append("tamanhoPagina", "10");
    return this.http.get<any>(`${this.RESOURCE_URL_CORRETORAS}/pesquisa`,
    {headers : this.httpOptions.headers, params : queryParams}).pipe(
      map(
        resultado => {
          if (resultado.resultado.totalRegistros > 0 && resultado.resultado.lista.length > 0) {
            return {
             lista: resultado.resultado.lista.map(corretora => {
              return <Corretoras> {
                id : corretora.id,
                nomeCorretora : corretora.nomeCorretora,
                nomeCooperativa : corretora.numeroCooperativa !== undefined ?
                  corretora.numeroCooperativa + " - " + corretora.nomeCooperativa :
                  corretora.idInstituicao + " - " + corretora.nomeCooperativa,
                numeroSusep : corretora.numeroSusep
              };
            }),
              paginacao: <PaginacaoCorretora> {
                pagina: pagina,
                tamanhoPagina: 10,
                totalRegistros: resultado.resultado.totalRegistros
              }
            };
          }
          return resultado;
      }),
      catchError((objError) => this.handleError(objError)));
  }

  public carregarCentrais(): Observable<InstituicaoModel[]> {
    return this.http.get<any>(`${this.RESOURCE_URL_CENTRAL}`, httpOptions).pipe(
      map(
        resposta => {
        if (resposta) {
          return resposta.resultado.filter((central) => central.isCentral);
        }
      }),
      catchError((objError) => this.handleError(objError)));
  }

  public carregarInstituicoes(): Observable<InstituicaoSimples[]> {
    return this.http.get<any>(`${this.RESOURCE_URL_INSTITUICOES}`, httpOptions).pipe(
      map(
        resposta => {
          if (resposta) {
            return resposta.resultado;
          }
      }),
      catchError((objError) => this.handleError(objError)));
  }

  obterCorretora(numeroSusepOuCNPJ : string): Observable<Corretora> {
    let queryParams = new HttpParams();
    if (numeroSusepOuCNPJ != undefined && numeroSusepOuCNPJ !== null) {
      queryParams = numeroSusepOuCNPJ.length > 13 ? queryParams.append("cnpj", numeroSusepOuCNPJ) : queryParams.append("numeroSusep", numeroSusepOuCNPJ);
    }
    queryParams = queryParams.append("codTipoInstituicao", UtilsEnum.TIPO_INSTIUICAO_COOPERATIVA.toString());
    return this.http.get<any>(`${this.RESOURCE_URL_CORRETORAS}/consulta`, {headers : this.httpOptions.headers, params : queryParams}).pipe(
      map(resposta => {
        if (resposta) {
          return resposta.resultado;
        }
      }),
      catchError((objError) => this.handleError(objError)));
  }

  public carregarCooperativasPorIdCentral(idCentral : number): Observable<InstituicaoModel[]> {
    return this.http.get<any>(`${this.RESOURCE_URL_COOPERATIVA}/${idCentral}`, this.httpOptions).pipe(
      map(resposta => {
        if (resposta) {
          return resposta.resultado;
        }
      }),
      catchError((objError) => this.handleError(objError)));
  }

  public validarVinculoExistente(idInstituicao : number, susep: string): Observable<VinculoCorretoraCooperativa> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("numeroSusep", susep).append("idInstituicao", idInstituicao.toString());
    return this.http.get<any>(`${this.RESOURCE_URL_CORRETORAS}/validar`, {headers : this.httpOptions.headers,  params : queryParams}).pipe(
      map(resposta => {
        if (resposta.resultado) {
          return resposta.resultado;
        }
      }),
      catchError((objError) => this.handleError(objError)));
  }

  public incluirVinculoCorretoraCentral(vinculo : VinculoCorretoraCooperativa): Observable<VinculoCorretoraCooperativa> {
    return this.http.post<VinculoCorretoraCooperativa>(`${this.RESOURCE_URL_CORRETORAS}`, vinculo, this.httpOptions).pipe(
      map(resposta => {
        this.customAlertService.abrirAlert(Color.SUCCESS, MsgSucessoEnum.MSG002_INCLUSAO_VINCULO_CORRETORA_COOPERATIVA);
        return resposta;
      }),
      catchError((objError) => this.handleError(objError)));
  }

  public excluirCorretora(vinculo : Object) {
    return this.http.put<void>(`${this.RESOURCE_URL_CORRETORAS}/comercializa`, vinculo).pipe(
      map(resposta => {
        this.customAlertService.abrirAlert(Color.SUCCESS, MsgSucessoEnum.MSG002_EXCLUSAO_VINCULO_CORRETORA_COOPERATIVA);
      }),
      catchError((objError) => this.handleError(objError))
    );
  }


}
