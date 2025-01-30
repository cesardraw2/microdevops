import {Injectable} from '@angular/core';
import {BaseService} from '@shared/services/base.service';
import {environment} from '@env/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {CustomAlertService} from '@shared/services/alert-custom.service';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Central} from '@app/models/central.model';
import {MsgErrorEnum} from '@shared/enum/message.enum';

@Injectable({
  providedIn: 'root'
})
export class GedService extends BaseService {
  API_GED = `${environment.REST_URL}/ged-gft-sisbr/v1`;
  DOCUMENTOS = `documentos`;

  constructor(private http: HttpClient,
              customAlertService: CustomAlertService) {
    super(customAlertService);
  }

  public buscarArquivos(idArquivo: number): Observable<Array<Central>> {
    return this.http.get<any>(`${this.API_GED}/${this.DOCUMENTOS}/${idArquivo}`, this.httpOptions)
      .pipe(catchError((error) => this.handleError(error, MsgErrorEnum.CONSULTA_CENTRAIS)));
  }
}

