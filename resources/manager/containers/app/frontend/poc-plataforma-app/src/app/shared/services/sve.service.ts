import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { CustomAlertService } from './alert-custom.service';
import { Observable } from 'rxjs';
import { MsgErrorEnum } from '../enum/message.enum';
import { catchError, map } from 'rxjs/operators';
import { Color } from '@sicoob/ui';
import { Validacao } from '@app/models/validacao.model';

@Injectable({
  providedIn: 'root'
})
export class SveService extends BaseService {
  RESOURCE_URL_SVE_PROPONENTE= `${environment.SERVICE_SVE}${environment.DOMAIN_SVE}/contratacao/proponente`;
  INSTITUICAO:'/instituicao';

  constructor(private http: HttpClient, customAlertService: CustomAlertService) {
    super(customAlertService);
  }

  public validarProponente(idPessoa: number, idInstituicao: number): Observable<Validacao> {
    return this.http.get<any>(`${this.RESOURCE_URL_SVE_PROPONENTE}/${idPessoa}${this.INSTITUICAO}/${idInstituicao}/validacao`, this.httpOptions).pipe(
      map(retornoGet => {
          if (retornoGet.resultado) { //VERIFICAR
            return retornoGet.resultado;
          } else {
            this.customAlertService.abrirAlert(Color.WARNING, MsgErrorEnum.MSG004_CORRETORA_NAO_ENCONTRADA); //verificar mensagem ideal para este caso
          }
        }),
      catchError((error) => this.handleError(error, MsgErrorEnum.CONSULTA_CORRETORA)) //verificar mensagem ideal para este caso*/
    ); 
  }

  /*
  "resultado":
	[]

  "resultado":
	[
		"CNAE Fiscal não foi preenchido",
		"Deve existir ao menos um sócio/sócio administrador vinculado ao CNPJ."
	]

  */
}
