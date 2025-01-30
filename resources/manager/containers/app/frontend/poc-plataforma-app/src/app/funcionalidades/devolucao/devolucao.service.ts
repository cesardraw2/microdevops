import {Injectable} from '@angular/core';
import {BaseService} from '@app/shared/services/base.service';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {Devolucao} from './models/devolucao.model';
import {Observable} from 'rxjs';
import {CustomAlertService} from '@app/shared/services/alert-custom.service';
import {Color} from '@sicoob/ui';
import {MsgSucessoEnum} from '@app/shared/enum/message.enum';
import {StatusEnum} from './enum/status.enum';
import {converterFiltroParamentros} from '@app/shared/util/filtros-utils';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class DevolucaoService extends BaseService {


  RESOURCE_URL_CENTRAL = `${environment.REST_URL}${environment.CENTRAL}`;
  RESOURCE_URL_COOPERATIVA = `${environment.REST_URL}${environment.COOPERATIVA}`;
  RESOURCE_URL_DEVOLUCAO = `${environment.REST_URL}${environment.DEVOLUCAO}`;
  RESOURCE_URL_DEVOLUCAO_STATUS = `${environment.REST_URL}${environment.DEVOLUCAO}${environment.STATUS}`;

  constructor(private http: HttpClient, customAlertService: CustomAlertService) {
    super(customAlertService);
  }

  carregarCentrais = () => this.http.get<any>(this.RESOURCE_URL_CENTRAL, httpOptions)
    .pipe(catchError((objError) => this.handleError(objError)));

  carregarCooperativas = (id: string) => this.http.get<any>(`${this.RESOURCE_URL_COOPERATIVA}?id=${id}`, httpOptions)
    .pipe(catchError((objError) => this.handleError(objError)));

  consultarDevolucao(filtro: Devolucao): Observable<any> {
    const params = converterFiltroParamentros(filtro);
    return this.http.get<any>(this.RESOURCE_URL_DEVOLUCAO, {params}).pipe(
      catchError((objError) => this.handleError(objError))
    );
  }

  incluirDevolucao(devolucao: Devolucao) {
    return this.http.post<any>(this.RESOURCE_URL_DEVOLUCAO, devolucao, httpOptions)
      .pipe(
        map(resposta => {
          this.customAlertService.abrirAlert(Color.SUCCESS, MsgSucessoEnum.MSG001_DEVOLUCAO_INCLUSAO);
        }),
        catchError((objError) => this.handleError(objError))
      );
  }

  alterarStatus(devolucao: Devolucao) {
    return this.http.put<any>(this.RESOURCE_URL_DEVOLUCAO_STATUS, devolucao, httpOptions)
      .pipe(
        map(resposta => {
          if (devolucao.status === StatusEnum.ENVIADO) {
            this.customAlertService.abrirAlert(Color.SUCCESS, MsgSucessoEnum.MSG001_DEVOLUCAO_STATUS_ENVIADA);
          } else if (devolucao.status === StatusEnum.ENCAMINHADO_PAGAMENTO) {
            this.customAlertService.abrirAlert(Color.SUCCESS, MsgSucessoEnum.MSG001_DEVOLUCAO_STATUS_ENCAMINHADA_PAGAMENTO);
          } else if (devolucao.status === StatusEnum.CANCELADO) {
            this.customAlertService.abrirAlert(Color.SUCCESS, MsgSucessoEnum.MSG001_DEVOLUCAO_STATUS_CANCELADO);
          } else if (devolucao.status === StatusEnum.CONCLUIDO) {
            this.customAlertService.abrirAlert(Color.SUCCESS, MsgSucessoEnum.MSG001_DEVOLUCAO_STATUS_CONCLUIDO);
          } else if (devolucao.status === StatusEnum.ENCAMINHADO_SOLICITANTE) {
            this.customAlertService.abrirAlert(Color.SUCCESS, MsgSucessoEnum.MSG001_DEVOLUCAO_STATUS_ENCAMINHADA_SOLICITANTE);
          } else if (devolucao.status === StatusEnum.ENCAMINHADA_ANALISE) {
            this.customAlertService.abrirAlert(Color.SUCCESS, MsgSucessoEnum.MSG001_DEVOLUCAO_STATUS_ENCAMINHADA_ANALISE);
          }
        }),
        catchError((objError) => this.handleError(objError))
      );
  }

}
