import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CustomAlertService } from '@shared/services/alert-custom.service';
import { Color } from '@sicoob/ui';
import { throwError } from 'rxjs';


const MSG_ERROR_PADRAO = 'Algo deu errado, por favor tente mais tarde.';
const INTERNAL_ERROR = 500;

export class BaseService {

  protected httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(protected customAlertService: CustomAlertService) {
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param httpError
   * @param msgError
   */
  handleError(httpError: HttpErrorResponse, msgError?: string) {
    if (httpError.error instanceof ErrorEvent) {
      console.error('Ocorreu um erro na nossa aplicação:', httpError.error.message);
    } else {
      console.error(`Backend retornou o seguinte erro ${httpError.status}, ` + `Corpo do erro: `, httpError.error);
    }
    const mensagem = this.capturaMensagemBackEnd(httpError).reduce((a, b) => `${a}, ${b}`);
    this.customAlertService.abrirAlert(Color.DANGER, mensagem);
    return throwError(mensagem);
  }

  private capturaMensagemBackEnd(error: HttpErrorResponse): Array<string> {
    if (error.status === INTERNAL_ERROR) {
      return [MSG_ERROR_PADRAO];
    }
    if (error.error.erro && error.error.erro.mensagem) {
      return [error.error.erro.mensagem];
    } else {
      return error.error && error.error.mensagens ? error.error.mensagens.map(msg => msg.mensagem) : [MSG_ERROR_PADRAO];
    }

  }
}
