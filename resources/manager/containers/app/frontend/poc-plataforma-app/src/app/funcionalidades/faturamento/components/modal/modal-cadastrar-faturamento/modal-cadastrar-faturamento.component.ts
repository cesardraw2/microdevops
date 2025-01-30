import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Color, MODAL_DATA, ModalRef} from '@sicoob/ui';
import {Base64Service, DadosArquivo} from '@shared/services/base64.service';
import {FaturamentoService} from '@funcionalidades/faturamento/faturamento.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsDatepickerConfig} from 'ngx-bootstrap';
import {CustomAlertService} from '@shared/services/alert-custom.service';
import {Store} from '@ngrx/store';
import * as FaturamentoReducer from '@funcionalidades/faturamento/reducers/faturamento.reducer';
import {UsuarioSicoob} from '@sicoob/security';
import {Subscription} from 'rxjs';
import {Arquivo} from '@funcionalidades/faturamento/models/arquivo.model';
import {TiposAquivosFaturamentosEnum} from '@funcionalidades/faturamento/enums/tipos-arquivos-faturamentos.enum';
import {IncluiFaturamentoModel} from '@funcionalidades/faturamento/models/request/inclui-faturamento-model';
import {DialogService} from '@shared/services/dialog.service';
import {TranslateService} from '@ngx-translate/core';

const UM_MES = 1;

@Component({
  selector: 'sc-modal-cadastrar-faturamento',
  templateUrl: './modal-cadastrar-faturamento.component.html',
  styleUrls: ['./modal-cadastrar-faturamento.component.css']
})
export class ModalCadastrarFaturamentoComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  arquivosNas: string[] = [];
  arquivos: Array<Arquivo> = [];
  form: FormGroup;
  bsConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    dateInputFormat: 'MM/YYYY',
    containerClass: 'theme-datapick',
    maxDate: new Date()
  };
  @ViewChild('inputFile')
  inputFile: ElementRef;


  constructor(private modalRef: ModalRef,
              @Inject(MODAL_DATA) private data: { usuario: UsuarioSicoob },
              private base64Service: Base64Service,
              private faturamentoService: FaturamentoService,
              private dialog: DialogService,
              private customAlertService: CustomAlertService,
              private store$: Store<FaturamentoReducer.State>,
              private translate: TranslateService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      instituicao: [null, Validators.required],
      data: [null, Validators.required],
      arquivoNas: [{value: null, disabled: true}, Validators.required]
    });
  }

  salvaBase64($event): void {
    this.subscription.add(this.base64Service.getArquivo($event.target.files).subscribe((arquivo: DadosArquivo) => {
      this.arquivos.push({
        tipo: TiposAquivosFaturamentosEnum.ARQUIVO_EXTRA_SISTEMA,
        dadosArquivo: arquivo
      });
      this.inputFile.nativeElement.value = '';
    }));
  }

  removeItemLista(arquivo: Arquivo) {
    this.arquivos.splice(this.arquivos.indexOf(arquivo), 1);
  }

  downloadArquivo(arquivo: Arquivo) {
    this.base64Service.downloadArquivo(arquivo.dadosArquivo);
  }

  novoFaturamento() {
    this.subscription.add(this.dialog.confirmacao('Deseja Iniciar faturamento').subscribe(() => {
      // TODO utilizar redux
      this.subscription.add(this.faturamentoService.incluirFaturamento(this.getModelIncluirFaturamento())
        .subscribe(() => {
          this.translate.get('MENSAGEM_SUCESSO.FATURAMENTO.MSG010').subscribe(msg => {
            this.customAlertService.abrirAlert(Color.SUCCESS, msg);
          });
          this.modalRef.close();
        }));
    }));
  }

  buscaArquivoNas() {
    this.arquivosNas = [];
    this.form.get('arquivoNas').reset();
    this.form.get('arquivoNas').markAsTouched();
    this.form.get('arquivoNas').disable();
    if (this.form.get('instituicao').valid && this.form.get('data').valid) {
      this.subscription.add(this.faturamentoService.consultaArquivoNas({
        ...this.form.value,
        idUnidadeInst: this.data.usuario.idUnidadeInstOrigem
      }).subscribe((resultado) => {
          if (resultado && resultado.length > 0) {
            this.form.get('arquivoNas').enable();
            this.arquivosNas = resultado;
          } else {
            this.arquivosNas = [];
            this.customAlertService.abrirAlert(Color.DANGER, 'Arquivos NAS não encontrados.');
          }
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getModelIncluirFaturamento(): IncluiFaturamentoModel {
    return {
      idInstituicao: this.form.get('instituicao').value,
      idUnidadeInst: this.data.usuario.idUnidadeInstOrigem,
      mes: (<Date>this.form.get('data').value).getMonth() + UM_MES,
      ano: (<Date>this.form.get('data').value).getFullYear(),
      nomeArquivoNAS: this.form.get('arquivoNas').value,
      documentos: this.arquivos.map(arquivo => {
        return {
          nome: arquivo.dadosArquivo.nomeArquivo,
          dados: arquivo.dadosArquivo.base64,
          extensao: arquivo.dadosArquivo.extensaoArquivo,
          tamanho: arquivo.dadosArquivo.tamanho,
          tipo: arquivo.tipo
        };
      })
    };
  }
}
