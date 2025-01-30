import {Injectable} from '@angular/core';
import {BaseService} from '@shared/services/base.service';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';
import {CustomAlertService} from '@shared/services/alert-custom.service';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Cooperativa} from '@app/models/cooperativa.model';
import {MsgErrorEnum} from '@shared/enum/message.enum';

@Injectable({
  providedIn: 'root'
})
export class CooperativaService extends BaseService {
  RESOURCE_URL_COOPERATIVA = `${environment.REST_URL}${environment.COOPERATIVA}`;

  constructor(private http: HttpClient,
              customAlertService: CustomAlertService) {
    super(customAlertService);
  }

  public carregarCooperativas(id: string): Observable<Array<Cooperativa>> {
    return this.http.get<any>(`${this.RESOURCE_URL_COOPERATIVA}?id=${id}`, this.httpOptions).pipe(
      catchError((error) => this.handleError(error, MsgErrorEnum.CONSULTA_COOPERATIVAS))
    );
  }
}
