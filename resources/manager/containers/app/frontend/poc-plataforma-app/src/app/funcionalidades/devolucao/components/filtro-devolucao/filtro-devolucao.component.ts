import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromDevolucao from '@funcionalidades/devolucao/reducers/devolucao.reducer';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cooperativa } from '../../models/cooperativa.model';
import { Store, select } from '@ngrx/store';
import { Devolucao } from '../../models/devolucao.model';
import { Central } from '../../models/central.model';
import { LoadCentrais, LoadCooperativas, LoadDevolucaos, CleanDevolucoes, UpdateStatusDevolucao } from '../../actions/devolucao.actions';

import * as cnpj from "@fnando/cnpj";
import * as cpf from "@fnando/cpf";
import { Color, ModalService } from '@sicoob/ui';
import { CustomAlertService } from '@app/shared/services/alert-custom.service';
import { ModalEditarDevolucaoComponent } from '../modal-editar-devolucao/modal-editar-devolucao.component';
import { StatusEnum } from '../../enum/status.enum';
import { ModalAcompanharDevolucaoComponent } from '../modal-acompanhar-devolucao/modal-acompanhar-devolucao.component';

@Component({
  selector: 'app-filtro-devolucao',
  templateUrl: './filtro-devolucao.component.html',
  styleUrls: ['./filtro-devolucao.component.scss']
})
export class FiltroDevolucaoComponent implements OnInit, OnDestroy  {

  cooperativas: Observable<Cooperativa[]>;
  centrais: Observable<Central[]>;
  form: FormGroup;
  devolucoes: Observable<Devolucao[]>;
  subscription: Subscription = new Subscription();
  devolucaoSelecioanda: Devolucao = new Devolucao();

  constructor(
    private fb: FormBuilder,
    private store$: Store<fromDevolucao.State>,
    private readonly alertService: CustomAlertService,
    private readonly modalService: ModalService) { }

  ngOnInit() {
    this.carregarForm();
    this.consultarCentrais();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store$.dispatch(new CleanDevolucoes());
  }

  consultarDevolucao() {
    this.store$.dispatch(new CleanDevolucoes());
    if (this.form.controls.central.value && this.form.controls.cooperativa.value) {
      this.store$.dispatch(new LoadDevolucaos(this.getDevolucao()));
      this.devolucoes = this.store$.pipe(select(fromDevolucao.getDevolucoes));
    } else {
      this.alertService.abrirAlert(Color.DANGER, 'Central e Cooperativas são obrigatórios.');
    }
  }

  enviarAnalise(devolucao: Devolucao) {
    devolucao.status = StatusEnum.ENVIADO.toString();
    this.store$.dispatch(new UpdateStatusDevolucao(devolucao));
    this.store$.pipe(select(fromDevolucao.getDevolucao));
  }

  abrirModalIncluir(){
    this.modalService.open(ModalEditarDevolucaoComponent, {data:{devolucao: new Devolucao(), titulo: "Inserir Devolução", status: StatusEnum.PENDENTE_ENVIO}});
  }

  visualizarValidarStatus(devolucao) {
    return (devolucao.status !== StatusEnum.PENDENTE_ENVIO) ;
  }

  abrirModalAltera(devolucaoSelecioanda: Devolucao){
    this.modalService.open(ModalEditarDevolucaoComponent, {data:{titulo: "Alterar Devolução", devolucao: devolucaoSelecioanda}});
  }

  abrirModalAcompanhar(devolucaoSelecioanda: Devolucao){
    this.modalService.open(ModalAcompanharDevolucaoComponent, {data:{devolucao: devolucaoSelecioanda}});
  }

  getDevolucao(): Devolucao {
    const retorno = new Devolucao();

    retorno.central = this.form.controls.central.value;
    retorno.cooperativa = this.form.controls.cooperativa.value;
    retorno.cpfCnpj = this.form.controls.cpfCnpj.value;
    retorno.produto = this.form.controls.produto.value;
    retorno.dataInicial = this.form.controls.dataInicial.value;
    retorno.dataFinal = this.form.controls.dataFinal.value;
    retorno.status = this.form.controls.statusDevolucao.value;

    return retorno;
  }

  consultarCooperativas() {
    if (this.form.controls.central.value) {
      this.store$.dispatch(new LoadCooperativas(this.form.controls.central.value));
      this.cooperativas = this.store$.pipe(select(fromDevolucao.getCooperativas));
      this.form.controls.cooperativa.setValue('');
    }
  }

  consultarCentrais() {
    this.store$.dispatch(new LoadCentrais());
    this.centrais = this.store$.pipe(select(fromDevolucao.getCentrais));
  }

  formatarCPFCNPJ() {
    if (this.form.controls.cpfCnpj.value.length === 14) {
      this.form.controls.cpfCnpj.setValue(cnpj.format(this.form.controls.cpfCnpj.value));
    } else if (this.form.controls.cpfCnpj.value.length === 11) {
      this.form.controls.cpfCnpj.setValue(cpf.format(this.form.controls.cpfCnpj.value));
    }
  }

  retirarFormatoCPFCNPJ() {
    if (this.form.controls.cpfCnpj.value.length >= 14) {
      this.form.controls.cpfCnpj.setValue(cnpj.strip(this.form.controls.cpfCnpj.value));
    } else if (this.form.controls.cpfCnpj.value.length === 11) {
      this.form.controls.cpfCnpj.setValue(cpf.strip(this.form.controls.cpfCnpj.value));
    }
  }


  private carregarForm() {
    this.form = this.fb.group({
      central: ['', [Validators.required]],
      cooperativa: ['', Validators.required],
      statusDevolucao:[''],
      dataInicial:[''],
      dataFinal:[''],
      produto:[''],
      cpfCnpj:['', [Validators.minLength(11), Validators.maxLength(14)]]
    });
  }

}
