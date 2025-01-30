import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MODAL_DATA, ModalRef} from '@sicoob/ui';
import {Base64Service} from '@shared/services/base64.service';
import {DialogService} from '@shared/services/dialog.service';
import {TiposAquivosFaturamentosEnum} from '@funcionalidades/faturamento/enums/tipos-arquivos-faturamentos.enum';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Arquivo} from '@funcionalidades/faturamento/models/arquivo.model';
import {StatusFaturamentoEnum} from '@funcionalidades/faturamento/enums/status-faturamento.enum';
import {GedService} from '@shared/services/ged.service';
import {UsuarioSicoob} from '@sicoob/security';
import {FaturamentoService} from '@funcionalidades/faturamento/faturamento.service';
import {Faturamento} from '@funcionalidades/faturamento/models/faturamento.model';
import {DocumentoFaturamentoModel} from '@funcionalidades/faturamento/models/request/documento-faturamento.model';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {CustomAlertService} from '@shared/services/alert-custom.service';
import {Store} from '@ngrx/store';
import * as FaturamentoReducer from '@funcionalidades/faturamento/reducers/faturamento.reducer';
import {UpdateFaturamentoAction} from '@funcionalidades/faturamento/actions/faturamento.actions';
import {DetalheFaturaResponse} from '@funcionalidades/faturamento/models/response/detalhe-fatura-response';

@Component({
  selector: 'sc-modal-acompanhar-faturamento',
  templateUrl: './modal-acompanhar-faturamento.component.html',
  styleUrls: ['./modal-acompanhar-faturamento.component.css']
})
export class ModalAcompanharFaturamentoComponent implements OnInit {
  private subscription = new Subscription();

  tiposArquivos: Array<TiposAquivosFaturamentosEnum> = [
    TiposAquivosFaturamentosEnum.ARQUIVO_FATURA,
    TiposAquivosFaturamentosEnum.OUTRAS_DOCUMENTACOES
  ];

  faturaEnviada: StatusFaturamentoEnum = StatusFaturamentoEnum.ENVIADO;
  faturaDisponivel: StatusFaturamentoEnum = StatusFaturamentoEnum.DISPONIVEL;
  faturaConstestada: StatusFaturamentoEnum = StatusFaturamentoEnum.CONTESTADA;
  faturaCancelada: StatusFaturamentoEnum = StatusFaturamentoEnum.CANCELADO;
  faturaConcluida: StatusFaturamentoEnum = StatusFaturamentoEnum.CONCLUIDO;

  buttonEncaminharIsDisable = true;
  buttonCancelarIsDisable = true;
  buttonContestarIsDisable = true;
  buttonConcluirIsDisable = true;

  form: FormGroup;
  msg: string;

  observacao: string;
  status: string;

  @ViewChild('inputFile')
  inputFile: ElementRef;

  constructor(private modalRef: ModalRef,
              @Inject(MODAL_DATA) public data: { faturamento: Faturamento, central: any, usuario: UsuarioSicoob },
              private store$: Store<FaturamentoReducer.State>,
              private gedService: GedService,
              private faturamentoService: FaturamentoService,
              private base64Service: Base64Service,
              private dialog: DialogService,
              private customAlertService: CustomAlertService,
              private fb: FormBuilder,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.preparaForm();
    this.habilitaButtonPeloStatusEtapa();
  }

  private preparaForm(): void {
    this.form = this.fb.group({
      faturamento: [this.data.faturamento],
      justificativa: [''],
      arquivos: this.fb.array([]),
    });
    this.preencheArquivos();
  }

  private addArquivo(arquivo: Arquivo, somenteLeitura = false): void {
    const arquivos = this.form.controls.arquivos as FormArray;
    arquivos.push(this.fb.group({
      id: arquivo.id,
      tipo: [arquivo.tipo, Validators.required],
      dadosArquivo: arquivo.dadosArquivo,
      somenteLeitura: somenteLeitura
    }));
    this.inputFile.nativeElement.value = '';
  }

  private preencheArquivos(): void {
    this.subscription.add(
      this.faturamentoService.buscarDocumentos(this.data.faturamento.id).subscribe((resposta: DetalheFaturaResponse) => {
        if (resposta && resposta.resultado && resposta.resultado.etapaAtual) {
          resposta.resultado.etapaAtual.documentos.forEach(doc =>
            this.addArquivo(
              <Arquivo>{
                id: doc.idDocumentoGED,
                tipo: doc.tipoDocumento
              }, true)
          );
          this.observacao = resposta.resultado.ultimaEtapa.observacoes;
          this.status = resposta.resultado.ultimaEtapa.status;
        }
      }));
  }

  adicionarArquivo($event): void {
    this.subscription.add(this.base64Service.getArquivo($event.target.files).subscribe((arquivo: any) => {
      this.addArquivo({tipo: arquivo.tipo, dadosArquivo: arquivo});
    }));
  }

  removeFaturamento(index) {
    this.subscription.add(this.translate.get('MENSAGEM_CONFIRMACAO.FATURAMENTO.MSG007').subscribe(msg => {
      this.subscription.add(this.dialog.confirmacao(msg).subscribe(() => {
        const arquivos = this.form.get('arquivos') as FormArray;
        arquivos.removeAt(index);
      }));
    }));
  }

  atualizaFaturamento(status: StatusFaturamentoEnum, validaCampoJustificativa, keyMsgTranslate) {
    this.verificaObrigatoriedadeJustificativa(validaCampoJustificativa);
    if (this.form.valid) {
      this.subscription.add(this.translate.get(keyMsgTranslate).subscribe(msg => {
          this.subscription.add(this.dialog.confirmacao(msg).subscribe(() => {
              this.subscription.add(this.translate.get(this.getKeyMsgSuccessTranslate(status)).subscribe(msgSucess => {
                this.store$.dispatch(new UpdateFaturamentoAction(this.getModelAtualizaFaturamento(status), msgSucess, this.modalRef));
              }));
            })
          );
        })
      );
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  verificaObrigatoriedadeJustificativa(habilitaValidacao) {
    if (habilitaValidacao) {
      this.form.get('justificativa').setValidators(Validators.required);
      this.form.get('justificativa').markAsTouched();
      this.form.get('justificativa').updateValueAndValidity();
    } else {
      this.form.get('justificativa').clearValidators();
      this.form.get('justificativa').markAsTouched();
      this.form.get('justificativa').updateValueAndValidity();
    }
  }

  /**
   * Valida todos os campos formGroup
   * @param formGroup | FormArray
   */
  private validateAllFormFields(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateAllFormFields(control);
      }
    });
  }

  getControlsTipo(index: number): AbstractControl {
    return (<FormGroup>this.form.get('arquivos')).controls[index].get('tipo');
  }

  getArquivo(index: number): Arquivo {
    return (<FormGroup>this.form.get('arquivos')).controls[index].value;
  }

  getControlsArquivos(): any {
    return (<FormGroup>this.form.get('arquivos')).controls;
  }

  tipoIsReadOnly(index: number): boolean {
    return (<FormGroup>this.form.get('arquivos')).controls[index].get('somenteLeitura').value;
  }

  isArquivoFaturaSelecionado() {
    return this.form.get('arquivos').value.some((arquivo: Arquivo) => arquivo.tipo === TiposAquivosFaturamentosEnum.ARQUIVO_FATURA);
  }

  downloadArquivo(arquivo: Arquivo) {
    if (arquivo.id) {
      // TODO utilizar redux (criar funcionalidade de ged)
      this.gedService.buscarArquivos(arquivo.id).subscribe((resposta: any) => {
        this.base64Service.downloadArquivo({
          nomeArquivo: 'atualizaCentral',
          base64: resposta.resultado.listaSequenciaisDocumento[0].arquivoCodificadoBase64,
          extensaoArquivo: resposta.resultado.listaSequenciaisDocumento[0].extensao.descricaoExtensao
        });
      });
    } else {
      this.base64Service.downloadArquivo(arquivo.dadosArquivo);
    }

  }

  habilitaButtonPeloStatusEtapa() {
    const status = this.form.get('faturamento').value.status.toString().toLowerCase();
    switch (status) {
      case StatusFaturamentoEnum.PROCESSAMENTO.toLowerCase():
      case StatusFaturamentoEnum.CONTESTADA.toLowerCase():
        this.buttonEncaminharIsDisable = false;
        this.buttonCancelarIsDisable = false;
        break;
      case StatusFaturamentoEnum.DISPONIVEL.toLowerCase():
        this.buttonContestarIsDisable = false;
        this.buttonConcluirIsDisable = false;
    }
  }

  private getModelAtualizaFaturamento(status: StatusFaturamentoEnum) {
    return {
      id: this.form.get('faturamento').value.id,
      idUnidadeInst: this.data.usuario.idUnidadeInstOrigem,
      status: status,
      observacao: this.form.get('justificativa').value,
      documentos: this.form.get('arquivos').value.filter(arq => !arq.somenteLeitura).map(arquivo => {
        return <DocumentoFaturamentoModel>{
          nome: arquivo.dadosArquivo.nomeArquivo,
          dados: arquivo.dadosArquivo.base64,
          extensao: arquivo.dadosArquivo.extensaoArquivo,
          tamanho: arquivo.dadosArquivo.tamanho,
          tipo: arquivo.tipo
        };
      })
    };
  }

  private getKeyMsgSuccessTranslate(status: StatusFaturamentoEnum) {
    switch (status) {
      case StatusFaturamentoEnum.DISPONIVEL:
        return 'MENSAGEM_SUCESSO.FATURAMENTO.MSG004';
      case StatusFaturamentoEnum.CANCELADO:
        return 'MENSAGEM_SUCESSO.FATURAMENTO.MSG005';
      case StatusFaturamentoEnum.CONTESTADA:
        return 'MENSAGEM_SUCESSO.FATURAMENTO.MSG006';
      case StatusFaturamentoEnum.CONCLUIDO:
        return 'MENSAGEM_SUCESSO.FATURAMENTO.MSG007';
    }
  }
}
