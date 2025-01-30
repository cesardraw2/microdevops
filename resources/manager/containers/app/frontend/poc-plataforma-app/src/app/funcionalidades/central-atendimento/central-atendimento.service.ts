import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsgErrorEnum } from '@app/shared/enum/message.enum';
import { CustomAlertService } from '@app/shared/services/alert-custom.service';
import { BaseService } from '@app/shared/services/base.service';
import { environment } from '@env/environment';
import { Color } from '@sicoob/ui';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Documento } from './models/documento.model';
import { Proposta } from './models/proposta.model';
import { DetalhePropostaResponse } from './models/response/detalhe-proposta-response';

@Injectable({
  providedIn: 'root'
})
export class CentralAtendimentoService extends BaseService {

  private API_DOCUMENTOS = `${environment.REST_URL}/sgr/v1/mag-documentos/proposta`;
  private API_DOCUMENTO = `${environment.REST_URL}/sgr/v1/mag-documentos`;
  private API_PROPOSTA = `${environment.REST_URL}/sgr/v1/mag-propostas/proponente`;
  private API_PROPOSTA_SVE = `${environment.REST_URL}/sve/v1/propostas`;

  constructor(private http: HttpClient,
    customAlertService: CustomAlertService) {
    super(customAlertService);
  }

  buscarPropostas(cpfCnjp: string): Observable<{propostas: Proposta[]}> {
    return this.http.get<DetalhePropostaResponse>(`${this.API_PROPOSTA}/${cpfCnjp}`, this.httpOptions).pipe(
      map(resposta => {
        if (resposta.resultado.length > 0) {
          return {
            propostas: resposta.resultado.map(resp => {
              return <Proposta>{
                numProposta: resp.id,
                produto: this.splitCamelCase(resp.tipo),
                data: resp.data,
                premio: resp.valorTotal,
                cobertura: resp.valorCoberturaPrincipal,
                situacao: resp.status.status
              };
            })
          };
        }
        return null;
      }),
      catchError((error) => this.handleError(error)));
  }


  buscarDocumentos(idProposta: string): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${this.API_DOCUMENTOS}/${idProposta}`, this.httpOptions).pipe(
      map((resposta: any) => {
        if (resposta.resultado) {
          return resposta.resultado;
        }
        this.customAlertService.abrirAlert(Color.WARNING, MsgErrorEnum.MSG006_CONSULTAR_PROPOSTA_DOCUMENTO);
      }),
      catchError((error) => this.handleError(error)));
  }

  obterArquivoProposta(idDocumento: string): Observable<Documento> {
    return this.http.get<Documento>(`${this.API_DOCUMENTO}/${idDocumento}`, this.httpOptions).pipe(
      map((resposta: any) => {
        if (resposta.resultado) {
          return resposta.resultado;
        }
        this.customAlertService.abrirAlert(Color.WARNING, MsgErrorEnum.MSG006_CONSULTAR_PROPOSTA_DOCUMENTO);
      }),
      catchError((error) => this.handleError(error)));
  }

  cancelarProposta(numProposta: string, justificativa: string) : Observable<any>{
    return this.http.patch<any>(`${this.API_PROPOSTA_SVE}/numero/${numProposta}/cancelamento`, justificativa, this.httpOptions).pipe(
      map(resposta => {
        return resposta.resultado;
      }),
      catchError((objError) => this.handleError(objError))
    );
  }

  splitCamelCase(str: string){
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

}


