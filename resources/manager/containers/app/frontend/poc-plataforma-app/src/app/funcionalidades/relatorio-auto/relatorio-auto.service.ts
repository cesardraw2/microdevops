import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConsultaRelatorioPlurianualModel} from '@funcionalidades/relatorio-auto/models/consulta-relatorio-plurianual.model';
import {BaseService} from '@app/shared/services/base.service';
import {CustomAlertService} from '@app/shared/services/alert-custom.service';
import {catchError, map} from 'rxjs/operators';
import {environment} from '@env/environment';
import {Color} from '@sicoob/ui';
import {MsgErrorEnum} from '@app/shared/enum/message.enum';

@Injectable({
  providedIn: 'root'
})
export class RelatorioAutoService extends BaseService {

  constructor(
    private http: HttpClient,
    customAlertService: CustomAlertService
  ) {
    super(customAlertService);
  }

  consultaRelatorioPlurianual(filtro: ConsultaRelatorioPlurianualModel) {
    const params: any = {
        idCooperativas: filtro.idCooperativas,
        dataInicio: filtro.dataInicio,
        dataFim: filtro.dataFim,
        pagina: filtro.pagina,
        tamanhoPagina: filtro.tamanhoPagina
      };
    if ( filtro.situacao && filtro.situacao !== '' ) { params['situacao'] = filtro.situacao; }
    if ( filtro.idCentral && filtro.idCentral !== 0 ) { params['idCentral'] = filtro.idCentral; }
    if (filtro.pa || filtro.pa === 0) {
      if ( filtro.pa >= 0 ) { params['pa'] = filtro.pa; }
    }
    return this.http.get<any[]>(`${environment.REST_URL}/seguro-auto/v1/plurianual/consulta-relatorio-plurianual`,
      {
      ...this.httpOptions,
        params
    }).pipe(
      map((resposta: any) => {
        if ( resposta.resultado.length > 0 ) {
          return resposta;
        }

        this.customAlertService.abrirAlert(Color.WARNING, MsgErrorEnum.RELATORIO_PROPOSTA_NAO_ENCONTRADA);
      }),
      catchError((error) => this.handleError(error))
    );
  }
}
