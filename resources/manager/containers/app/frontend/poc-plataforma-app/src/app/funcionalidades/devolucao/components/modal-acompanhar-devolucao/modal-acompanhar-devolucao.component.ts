import { Component, OnInit, Inject } from '@angular/core';
import { ModalRef, MODAL_DATA } from '@sicoob/ui';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Base64Service } from '@app/shared/services/base64.service';
import { Store, select } from '@ngrx/store';
import * as fromDevolucao from '@funcionalidades/devolucao/reducers/devolucao.reducer';
import * as fromAuth from '@sicoob/security';
import { Devolucao } from '../../models/devolucao.model';
import { StatusEnum } from '../../enum/status.enum';
import { UpdateStatusDevolucao } from '../../actions/devolucao.actions';

@Component({
  selector: 'app-modal-acompanhar-devolucao',
  templateUrl: './modal-acompanhar-devolucao.component.html',
  styleUrls: ['./modal-acompanhar-devolucao.component.scss']
})
export class ModalAcompanharDevolucaoComponent implements OnInit {

  devolucao: Devolucao;
  form: FormGroup;

  constructor( public ref: ModalRef,
    private fb: FormBuilder,
    @Inject(MODAL_DATA) public data: any,
    public authStore$: Store<fromAuth.State>,
    private store$: Store<fromDevolucao.State>
    ) { }

  ngOnInit() {
    this.devolucao = this.data.devolucao;
    this.carregarForm();
  }

  salvarEtapa(etapa: string) {
    this.validarJustificativa(etapa);
    this.devolucao.status = etapa;
    //this.store$.dispatch(new UpdateStatusDevolucao(this.devolucao));
    //this.store$.pipe(select(fromDevolucao.getDevolucao));
    //this.close(true);
  }

  validarJustificativa(etapa: string) {
    const justificativa = this.form.get('justificativa');
    justificativa.setValidators(null);
    if (etapa === StatusEnum.CANCELADO.toString()
        || etapa === StatusEnum.ENCAMINHADO_SOLICITANTE.toString()
        || etapa === StatusEnum.ENCAMINHADA_ANALISE.toString()) {
      justificativa.setValidators([Validators.required]);
    }
    justificativa.updateValueAndValidity();
    return true;
  }

  private carregarForm() {
    this.form = this.fb.group({});
  }

  close(s: boolean) {
    this.ref.close(s);
  }
}
