import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Faturamento} from '@funcionalidades/faturamento/models/faturamento.model';
import {Observable} from 'rxjs';
import * as FaturamentoReducer from '@funcionalidades/faturamento/reducers/faturamento.reducer';
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ModalService} from '@sicoob/ui';
import {BsDatepickerConfig} from 'ngx-bootstrap';
import * as fromAuth from '@sicoob/security';
import {UsuarioSicoob} from '@sicoob/security';
import {TranslateService} from '@ngx-translate/core';
import {ModalCadastrarFaturamentoComponent} from '@funcionalidades/faturamento/components/modal/modal-cadastrar-faturamento/modal-cadastrar-faturamento.component';
import {ModalAcompanharFaturamentoComponent} from '@funcionalidades/faturamento/components/modal/modal-acompanhar-faturamento/modal-acompanhar-faturamento.component';
import {StatusFaturamentoEnum} from '@funcionalidades/faturamento/enums/status-faturamento.enum';
import {FindFaturamentosAction, StartFaturamentoAction} from '@funcionalidades/faturamento/actions/faturamento.actions';
import {AsyncPipe} from '@angular/common';
import {Paginacao} from '@funcionalidades/faturamento/models/paginacao.model';


@Component({
  selector: 'sc-container-faturamento-prestamista',
  templateUrl: './container-faturamento-prestamista.component.html',
  styleUrls: ['./container-faturamento-prestamista.component.scss'],
  providers: [
    AsyncPipe
  ]
})
export class ContainerFaturamentoPrestamistaComponent implements OnInit {
  faturamentos$: Observable<Array<Faturamento>>;
  paginacao$: Observable<Paginacao>;

  form: FormGroup;
  statusFaturamento: Array<StatusFaturamentoEnum> = [
    StatusFaturamentoEnum.ENVIADO,
    StatusFaturamentoEnum.PROCESSAMENTO,
    StatusFaturamentoEnum.DISPONIVEL,
    StatusFaturamentoEnum.CONTESTADA,
    StatusFaturamentoEnum.CANCELADO,
    StatusFaturamentoEnum.CONCLUIDO
  ];
  bsConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    dateInputFormat: 'MM/YYYY',
    containerClass: 'theme-datapick',
    maxDate: new Date()
  };
  centralPesquisada;
  usuario: UsuarioSicoob;

  constructor(private fb: FormBuilder,
              private store$: Store<FaturamentoReducer.State>,
              private authStore$: Store<fromAuth.State>,
              private modalService: ModalService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.carregarForm();
    this.authStore$.pipe(select(fromAuth.selectSicoobUser)).subscribe(resultado => {
      this.usuario = resultado;
    });
  }

  private carregarForm() {
    this.form = this.fb.group({
      instituicao: ['', Validators.required],
      statusFaturamento: ['', Validators.required],
      dataInicio: [this.getMesAnterior(), [
        this.validaDataInicioMenorDataFim()
      ]],
      dataFim: [new Date(), [
        this.validaDataFimMaiorDataInicio()
      ]]
    });
  }

  consultar(formInstituicao: FormGroup, pagina?: number) {
    if (this.form.valid && (formInstituicao.valid || formInstituicao.disabled)) {
      this.centralPesquisada = formInstituicao.get('central').value.numeroCooperativa;
      this.store$.dispatch(new FindFaturamentosAction({...this.form.value, cooperativa: this.form.get('instituicao').value}, pagina));
      this.faturamentos$ = this.store$.pipe(select(FaturamentoReducer.getFaturamentos));
      this.paginacao$ = this.store$.pipe(select(FaturamentoReducer.getPaginacao));
    } else {
      this.validateAllFormFields(this.form);
      this.validateAllFormFields(formInstituicao);
    }
  }

  abrirModalNovoFaturamento() {
    this.modalService.open(ModalCadastrarFaturamentoComponent, {data: {usuario: this.usuario}}).afterClosed();
  }

  abrirModalAcompanhamento(faturamento: Faturamento) {
    this.modalService.open(ModalAcompanharFaturamentoComponent, {
      data: {
        faturamento: faturamento,
        central: this.centralPesquisada,
        usuario: this.usuario
      }
    }).afterClosed();
  }

  iniciarFaturamento(faturamento: any) {
    this.translate.get('MENSAGEM_SUCESSO.FATURAMENTO.MSG010').subscribe(msg => {
      this.store$.dispatch(new StartFaturamentoAction(faturamento.id, this.usuario.login, msg));
    });
  }

  private getMesAnterior(): Date {
    const data = new Date();
    data.setMonth(data.getMonth() - 1);
    return data;
  }

  /**
   * Valida todos os campos formGroup
   * @param formGroup
   */
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }


  /**
   * Verifica se data inicio é MENOR que data fim
   * atualiza o formControl para invalid se data for maior que data fim
   */
  validaDataInicioMenorDataFim(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      if (!!this.form) {
        if (control.value > this.form.get('dataFim').value || (!control.value && this.form.get('dataFim').value)) {
          return {'DataInicioInvalida': this.translate.get('VALIDACAO.ERROR_DATA_INICIAL_MAIOR_DATA_FINAL')};
        }
      }
      return null;
    };
  }

  /**
   * Verifica se data fim é MAIOR que data inicio
   * atualiza o formControl para invalid se data for menor que data inicio
   */
  validaDataFimMaiorDataInicio(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      if (!!this.form) {
        if (control.value < this.form.get('dataInicio').value) {
          return {'DataFimInvalida': this.translate.get('VALIDACAO.ERROR_DATA_FINAL_MENOR_DATA_FINAL')};
        }
      }
      return null;
    };
  }

  /**
   * reflesh nos campos de data, atualizando valores e suas devidas validações;
   */
  atualizaValidacaoData() {
    this.form.get('dataFim').updateValueAndValidity();
    this.form.get('dataInicio').updateValueAndValidity();
  }

  arquivoEnviado(faturamento: Faturamento) {
    if (faturamento.status) {
      return StatusFaturamentoEnum.ENVIADO === faturamento.status;
    }
    return false;
  }

  pageChanged(formInstituicao: FormGroup, $event: number) {
    this.consultar(formInstituicao, $event - 1);
  }
}
