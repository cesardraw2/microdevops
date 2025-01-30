import {Component, OnInit, Inject} from '@angular/core';
import {ModalRef, MODAL_DATA, Color} from '@sicoob/ui';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as fromAuth from '@sicoob/security';
import * as cnpj from '@fnando/cnpj';
import * as cpf from '@fnando/cpf';
import {DadosArquivo, Base64Service} from '@app/shared/services/base64.service';
import * as fromDevolucao from '@funcionalidades/devolucao/reducers/devolucao.reducer';
import {Store, select} from '@ngrx/store';
import {Devolucao} from '@funcionalidades/devolucao/models/devolucao.model';
import {LoadDevolucaos, AddDevolucao, UpdateDevolucao} from '@funcionalidades/devolucao/actions/devolucao.actions';
import {StatusEnum} from '@funcionalidades/devolucao/enum/status.enum';
import {MsgErrorEnum} from '@app/shared/enum/message.enum';
import {CustomAlertService} from '@app/shared/services/alert-custom.service';

@Component({
  selector: 'app-modal-editar-devolucao',
  templateUrl: './modal-editar-devolucao.component.html',
  styleUrls: ['./modal-editar-devolucao.component.css']
})
export class ModalEditarDevolucaoComponent implements OnInit {

  form: FormGroup;
  arquivos: Array<DadosArquivo> = [];
  devolucao = new Devolucao();
  titulo: string;

  constructor(
    public ref: ModalRef,
    private fb: FormBuilder,
    @Inject(MODAL_DATA) public data: any,
    private base64Service: Base64Service,
    public authStore$: Store<fromAuth.State>,
    private store$: Store<fromDevolucao.State>
  ) {
  }

  ngOnInit() {
    this.carregarForm();
    this.devolucao = this.data.devolucao;
    this.titulo = this.data.titulo;
    if (this.data.status) {
      this.devolucao.status = this.data.status;
    }
    this.setFormulario(this.devolucao);
  }

  incluir(): void {
    this.store$.dispatch(new AddDevolucao(this.devolucao));
    this.store$.pipe(select(fromDevolucao.getDevolucao));
    this.close(true);
  }

  alterar(): void {
    this.store$.dispatch(new UpdateDevolucao(this.devolucao));
    this.store$.pipe(select(fromDevolucao.getDevolucao));
    this.close(true);
  }

  salvarPendenteEnvio() {
    this.devolucao.status = StatusEnum.PENDENTE_ENVIO.toString();
    this.setarDevolucao();
    this.incluir();
  }

  iniciarDevolucao(): void {
    this.devolucao.status = StatusEnum.ENVIADO.toString();
    this.setarDevolucao();
    this.devolucao.id ? this.alterar() : this.incluir();
  }

  setarDevolucao() {
    this.devolucao.central = this.form.controls.central.value;
    this.devolucao.cooperativa = this.form.controls.cooperativa.value;
    this.devolucao.cpfCnpj = this.form.controls.cpfCnpj.value;
    this.devolucao.produto = this.form.controls.produto.value;
    this.devolucao.numeroContrato = this.form.controls.numeroContrato.value;
    this.devolucao.produto = this.form.controls.produto.value;
    this.devolucao.tipoConta = this.form.controls.tipoConta.value;
    this.devolucao.numeroContaCorrenteCooperativa = this.form.controls.numeroCooperativaConta.value;
    this.devolucao.numeroContaCorrente = this.form.controls.numeroContaCorrente.value;
    this.devolucao.arquivos = this.arquivos;
  }

  setFormulario(devolucaoParam: Devolucao) {
    this.arquivos = devolucaoParam.arquivos ? devolucaoParam.arquivos : new Array<DadosArquivo>();
    this.form.controls.central.setValue(devolucaoParam.central);
    this.form.controls.cooperativa.setValue(devolucaoParam.cooperativa);
    this.form.controls.cpfCnpj.setValue(devolucaoParam.cpfCnpj);
    this.form.controls.numeroContrato.setValue(devolucaoParam.numeroContrato);
    this.form.controls.produto.setValue(devolucaoParam.produto);
    this.form.controls.tipoConta.setValue(devolucaoParam.tipoConta);
    this.form.controls.numeroCooperativaConta.setValue(devolucaoParam.numeroContaCorrenteCooperativa);
    this.form.controls.numeroContaCorrente.setValue(devolucaoParam.numeroContaCorrente);
  }

  salvaBase64($event): void {
    this.base64Service.getArquivo($event.target.files).subscribe((arquivo: DadosArquivo) => {
      this.arquivos.push(arquivo);
    });
  }

  removeItemLista(arquivo: DadosArquivo) {
    this.arquivos.splice(this.arquivos.indexOf(arquivo), 1);
  }

  visualizarValidarStatus() {
    return (this.devolucao.status !== StatusEnum.PENDENTE_ENVIO);
  }

  verificarArquivos() {
    return (this.arquivos.length === 0);
  }

  visualizarArquivo(arquivo: DadosArquivo) {
    this.base64Service.downloadArquivo(arquivo);
  }

  formatarCPFCNPJ() {
    if (this.form.controls.cpfCnpj.value) {
      if (this.form.controls.cpfCnpj.value.length === 14) {
        this.form.controls.cpfCnpj.setValue(cnpj.format(this.form.controls.cpfCnpj.value));
      } else if (this.form.controls.cpfCnpj.value.length === 11) {
        this.form.controls.cpfCnpj.setValue(cpf.format(this.form.controls.cpfCnpj.value));
      }
    }
  }

  retirarFormatoCPFCNPJ() {
    if (this.form.controls.cpfCnpj.value) {
      if (this.form.controls.cpfCnpj.value.length >= 14) {
        this.form.controls.cpfCnpj.setValue(cnpj.strip(this.form.controls.cpfCnpj.value));
      } else if (this.form.controls.cpfCnpj.value.length === 11) {
        this.form.controls.cpfCnpj.setValue(cpf.strip(this.form.controls.cpfCnpj.value));
      }
    }
  }

  private carregarForm() {
    this.form = this.fb.group({
      central: ['', [Validators.required]],
      cooperativa: ['', [Validators.required]],
      tipoConta: ['', [Validators.required]],
      numeroContaCorrente: ['', [Validators.required]],
      numeroCooperativaConta: ['', [Validators.required]],
      numeroContrato: ['', [Validators.required]],
      produto: ['', [Validators.required]],
      nomeRazaoSocial: [''],
      cpfCnpj: ['', [Validators.minLength(11), Validators.maxLength(14), Validators.required]]
    });
  }

  close(s: boolean) {
    this.ref.close(s);
  }
}
