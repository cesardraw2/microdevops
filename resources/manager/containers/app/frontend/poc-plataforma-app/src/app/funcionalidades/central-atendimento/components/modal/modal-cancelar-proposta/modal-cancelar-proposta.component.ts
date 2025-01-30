import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proposta } from '@app/funcionalidades/central-atendimento/models/proposta.model';
import { MsgSucessoEnum } from '@app/shared/enum/message.enum';
import { CustomAlertService } from '@app/shared/services/alert-custom.service';
import { MsgErrorEnum } from '@shared/enum/message.enum';
import { Color, ModalRef, MODAL_DATA } from '@sicoob/ui';
import { CentralAtendimentoService } from './../../../central-atendimento.service';
import { CancelamentoEnum } from './../../../models/cancelamento.model';

@Component({
  selector: 'sc-modal-cancelar-proposta',
  templateUrl: './modal-cancelar-proposta.component.html',
  styleUrls: ['./modal-cancelar-proposta.component.css']
})
export class ModalCancelarPropostaComponent implements OnInit {

  formConsulta: FormGroup;
  modalReturn = {
    resultado: false,
    mensagem: ''
  };

  constructor(public ref: ModalRef,
    @Inject(MODAL_DATA) public data: Proposta,
    private fb: FormBuilder,
    private atendimentoService: CentralAtendimentoService,
    private alertService: CustomAlertService) { }

  ngOnInit() {
    this.formConsulta = this.fb.group({
      justificativa: ['', Validators.pattern('.+')]
    });
  }

  cancelarProposta() {
    if (this.formConsulta.valid) {
      this.atendimentoService.cancelarProposta(this.data.numProposta, this.formConsulta.get("justificativa").value).subscribe(resultado => {
        if (resultado) {
          //Pode acontecer de vir o resultado positivo, mas sem o campo Observacoes
          resultado.Observacao ? this.modalReturn.mensagem = resultado.Observacao : this.modalReturn.mensagem = MsgSucessoEnum.MSG001_DEVOLUCAO_STATUS_CANCELADO;
          this.modalReturn.mensagem != '' ? this.modalReturn.resultado = true : this.modalReturn.resultado = false;
          this.ref.close(this.modalReturn.mensagem);
        }
      });
    }
    else {
      this.alertService.abrirAlert(Color.DANGER, MsgErrorEnum.CANCELAR_PROPOSTA_SEM_JUSTIFICATIVA);
    }
  }

  close() {
    this.ref.close('');
  }

  public getJustificativasCancelamento() {
    return Object.values(CancelamentoEnum);
  }

}
