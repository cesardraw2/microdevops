import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import { CustomAlertService } from '@app/shared/services/alert-custom.service';
import * as CentralAtendimentoReducer from '@funcionalidades/central-atendimento/reducers/central-atendimento.reducer';
import { select, Store } from '@ngrx/store';
import { Color, ModalService } from '@sicoob/ui';
import { Observable } from 'rxjs';
import { ModalCancelarPropostaComponent } from '../../components/modal/modal-cancelar-proposta/modal-cancelar-proposta.component';
import { Proposta } from '../../models/proposta.model';
import { CleanPropostasAction, FindPropostasAction } from './../../actions/central-atendimento.actions';
import * as fromCapes from '@shared/components/capes/reducers/capes.reducer';


@Component({
  selector: 'sc-container-consulta-proposta',
  templateUrl: './container-consulta-proposta.component.html',
  styleUrls: ['./container-consulta-proposta.component.css']
})
export class ContainerConsultaPropostaComponent implements OnInit, OnDestroy, AfterViewInit {

  propostas$: Observable<Array<Proposta>>;
  proponente: PessoaModel;

  formConsulta: FormGroup;
  situacoesIncancelaveis: string[] = ['Implantada','Aceita', 'Recusada', 'Cancelada'];
  resultadoCancelamento = {
    resultado: false,
    mensagem: ''
  };

  mensagemSucesso: string;

  constructor(private fb: FormBuilder, private store$: Store<CentralAtendimentoReducer.State>,
    private router: Router,
    private modalService: ModalService,
    private alertService: CustomAlertService,
    private capesStore$: Store<fromCapes.State>) { }


  ngAfterViewInit(): void {

    this.capesStore$.pipe(select(fromCapes.getCapes)).subscribe((prop:PessoaModel) => {
      this.proponente = prop;
      if (this.proponente != null && this.proponente.idPessoa) {
        this.formConsulta.controls.cpfCnpj.setValue(this.proponente.cpfCnpj);
        this.consultar();
      }
    })
  }
  
  ngOnDestroy(): void {
    this.store$.dispatch(new CleanPropostasAction());
  }
  
  ngOnInit() {
    this.formConsulta = this.fb.group({
      cpfCnpj: ['', [Validators.minLength(11), Validators.maxLength(14), Validators.pattern('^[0-9]*$')]],
      numeroProposta: [{ value: '', disabled: true }],
      situacaoBusca: [{ value: '', disabled: true }]
    });
  }



  resolverPedencia(proposta: Proposta) {
    alert('Resolver Pendência');
  }

  cancelarProposta(proposta: Proposta) {
    this.modalService.open(ModalCancelarPropostaComponent, {
      data: proposta
    }).afterClosed().subscribe(cancelado => {
      if (cancelado != '') {
        this.mensagemSucesso = cancelado;
        this.alertService.abrirAlert(Color.SUCCESS, this.mensagemSucesso);
      }
    });

  }

  detalharProposta(proposta: Proposta) {
    this.router.navigateByUrl(`central-atendimento/detalha-proposta/${proposta.numProposta}`);
  }

  isCancelarDisponivel(proposta){
    return !this.situacoesIncancelaveis.includes(proposta.situacao);
  }

  isSituacaoPendente(proposta: Proposta) {
    if(proposta.situacao === "Pendente"){
      return true;
    }else{
      return false;
    }
  }

  consultar() {
    this.store$.dispatch(new CleanPropostasAction());
    if (this.formConsulta.valid) {
      this.store$.dispatch(new FindPropostasAction({ ...this.formConsulta.value, cpfCnpj: this.formConsulta.get('cpfCnpj').value }));
      this.propostas$ = this.store$.pipe(select(CentralAtendimentoReducer.getPropostas));
    } else {
      this.validateAllFormFields(this.formConsulta);
    }
  }

  /**
   * Valida todos os campos formGroup
   * @param formGroup
   */
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
