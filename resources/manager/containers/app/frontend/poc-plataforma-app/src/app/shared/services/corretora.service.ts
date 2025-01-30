import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { CustomAlertService } from './alert-custom.service';
import { Corretora } from '@app/models/corretora.model';
import { Observable } from 'rxjs';
import { MsgErrorEnum } from '../enum/message.enum';
import { catchError, map } from 'rxjs/operators';
import { Color } from '@sicoob/ui';

@Injectable({
  providedIn: 'root'
})
export class CorretoraService extends BaseService {
  RESOURCE_URL_CORRETORA = `${environment.REST_URL}/sgr/v1${environment.CORRETORAS}`;
  INSTITUICOES = `/instituicoes`;

  constructor(private http: HttpClient,
              customAlertService: CustomAlertService) {
    super(customAlertService);
  }

  public obterCorretora(id: number): Observable<Corretora> {
    return this.http.get<any>(`${this.RESOURCE_URL_CORRETORA}${this.INSTITUICOES}/${id}`, this.httpOptions).pipe(
      map(
        resultado => {
          if (resultado.resultado) {
            return resultado.resultado;
          } else {
            this.customAlertService.abrirAlert(Color.WARNING, MsgErrorEnum.MSG004_CORRETORA_NAO_ENCONTRADA);
          }
        }),
      catchError((error) => this.handleError(error, MsgErrorEnum.CONSULTA_CORRETORA))
    );
  }
}
