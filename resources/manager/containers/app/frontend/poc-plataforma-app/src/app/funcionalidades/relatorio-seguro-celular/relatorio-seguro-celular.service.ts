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
export class RelatorioSeguroCelularService extends BaseService {

  constructor(
    private http: HttpClient,
    customAlertService: CustomAlertService
  ) {
    super(customAlertService);
  }

  consultaRelatorio(filtro: ConsultaRelatorioPlurianualModel) {
    const params: any = {
      idCooperativa: filtro.idCooperativa,
      pa: filtro.pa,
      dataInicio: filtro.dataInicio,
      dataFim: filtro.dataFim,
      pagina: filtro.pagina,
      tamanhoPagina: filtro.tamanhoPagina,
      central: filtro.central,
      isGerarRelatorio: filtro.isGerarRelatorio
    };
    if ( filtro.idCentral && filtro.idCentral !== 0 ) { params['idCentral'] = filtro.idCentral; }
    if (filtro.pa || filtro.pa === 0) {
      if ( filtro.pa >= 0 ) { params['pa'] = filtro.pa; }
    }
    return this.http.get<any[]>(`${environment.REST_URL}/seguro-celular/v1/contratacao/apolices`,
      {
        ...this.httpOptions,
        params
      }).pipe(
      map((resposta: any) => {
        if ( resposta.paginacao.totalRegistros > 0 ) {
          return resposta;
        }

        this.customAlertService.abrirAlert(Color.WARNING, MsgErrorEnum.RELATORIO_PROPOSTA_NAO_ENCONTRADA);
      }),
      catchError((error) => this.handleError(error))
    );
  }
}
