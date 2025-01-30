import {Injectable} from '@angular/core';
import {observable, Observable} from 'rxjs';
import {ModalService} from '@sicoob/ui';
import {DialogoConfirmacaoComponent} from '@shared/components/dialogo-confirmacao/dialogo-confirmacao.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: ModalService) {
  }

  public confirmacao(mensagem: string,
                     titulo = 'Confirmação',
                     labelConfirmacao = 'SIM',
                     labelCancelamento = 'NÃO'
  ): Observable<any> {
    return new Observable(subscriber => {
      this.dialog.open(DialogoConfirmacaoComponent, {
        data: {
          titulo: titulo,
          mensagem: mensagem,
          labelConfirmacao: labelConfirmacao,
          labelCancelamento: labelCancelamento,
        }
      }).afterClosed().subscribe(confirmado => {
        if (confirmado) {
          subscriber.next(true);
        } else {
          subscriber.error(false);
        }
        subscriber.complete();
      });
    });
  }
}
