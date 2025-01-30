import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, Inject, Injectable } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, Validators, ValidatorFn, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import * as fromAuth from '@sicoob/security';
import * as fromCapes from '@app/shared/components/capes/reducers/capes.reducer';
import { Store, select } from '@ngrx/store';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import { TranslateService } from '@ngx-translate/core';
import { FindCapesAction, CleanCapesAction, FindCapesSuccessAction } from '@app/shared/components/capes/actions/capes.actions';
import { UsuarioSicoob } from '@sicoob/security';
import { CapesService } from '@app/shared/services/capes.service';
import { ModalRef, ModalService, AlertService } from '@sicoob/ui';
import { ModalListarProponenteComponent } from './modal/modal-listar-proponente/modal-listar-proponente.component';
import { RespostaPessoaModel } from './models/response/response.pessoa.model';


const ERROR_CONSULTA = 'Dados não encontrados';
const LIMITE_TOTAL_REGISTRO: number = 50;

@Component({
  selector: 'sc-capes-filtro',
  templateUrl: './capes-filtro.component.html',
  styleUrls: ['./capes-filtro.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CapesFiltroComponent,
      multi: true
    }
  ]
})
export class CapesFiltroComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() labelCpfCnpj = 'Cpf / Cnpj';

  @Input() placeHolder = this.getTranslate('CAPES_FILTRO.PLACEHOLDER.CPFCNPJ');

  @Output() valueChange = new EventEmitter();

  @Input() isReadOnly = true;

  private innerValue: any;
  private subscription = new Subscription();

  pessoa: Observable<PessoaModel>;
  formulario: FormGroup;
  dadosRetorno: string = '';
  usuario: UsuarioSicoob;

  pessoas: PessoaModel[];

  itemsFiltro = [
    {
      label: this.getTranslate('CAPES_FILTRO.FILTRO_LABEL.CPFCNPJ'),
      value: "cpfCnpj"
    },
    {
      label: this.getTranslate('CAPES_FILTRO.FILTRO_LABEL.NOMERAZAOSOCIAL'),
      value: "nomeRazaoSocial"
    },
    {
      label: this.getTranslate('CAPES_FILTRO.FILTRO_LABEL.APELIDO'),
      value: "apelido"
    }
  ];
  filtroSelecionando = this.itemsFiltro[0].value;
  respostaPessoaModel: RespostaPessoaModel;
  isCpfCnpj: boolean;
  isNomeRazaoSocial: boolean;
  isApelido: boolean;


  constructor(private store$: Store<fromCapes.State>,
              private authStore$: Store<fromAuth.State>,
              private cdf: ChangeDetectorRef,
              private fb: FormBuilder,
              private translate: TranslateService,
              private capesService: CapesService,
              private modalService: ModalService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.isCpfCnpj = true;
    this.isNomeRazaoSocial = false;
    this.isApelido = false;

    this.store$.dispatch(new CleanCapesAction());
    this.authStore$.pipe(select(fromAuth.selectSicoobUser)).subscribe(resultado => {
      this.usuario = resultado;
    });

    this.formulario = this.fb.group({
      tipoFiltro: [this.filtroSelecionando],
      cpfCnpj: ['', [Validators.required, this.validaPessoaEncontrada(), Validators.pattern("^(\\s*[0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2}\\s*)$|^(\\s*[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2}\\s*)$")]],
    });
    this.pessoa = this.store$.pipe(select(fromCapes.getCapes));
  }

  consultarPessoaKeyEvent(event) {
    if (event.keyCode === 13) { // ENTER key
      this.consultaPessoas();
    }
  }

  public consultaPessoas() {
    if (this.formulario.valid) {
      let pessoaFiltro = {
        cpfCnpj: this.isCpfCnpj ? this.retirarCaracteres() : '',
        nomePessoa: this.isNomeRazaoSocial ? this.formulario.get('cpfCnpj').value : '',
        nomeApelido: this.isApelido ? this.formulario.get('cpfCnpj').value : '',
        idInstituicao: (<any>this.usuario).idInstituicao || this.usuario.idInstituicaoOrigem
      };

      if (this.isCpfCnpj) {
        this.capesService.consultarCpfCnpj(pessoaFiltro).subscribe(pessoaResp => {
          if (pessoaResp) {
            this.respostaPessoaModel = {
              ordemCrescente: true,
              pagina: 0,
              resultado: [pessoaResp],
              tamanhoPagina: 0,
              totalRegistros: 1
            };
            this.apresentarListarSelecionarProponenteModal(this.respostaPessoaModel, pessoaFiltro);
          }
        });
      } else {
        this.capesService.consultarNomeOuApelido(pessoaFiltro, 0, 10).subscribe(pessoaResp => {
         this.respostaPessoaModel = pessoaResp;
          if (this.respostaPessoaModel?.totalRegistros > 0) {
            this.apresentarListarSelecionarProponenteModal(this.respostaPessoaModel, pessoaFiltro);
          }
        });
      }
    }
  }

  apresentarListarSelecionarProponenteModal(pessoas: RespostaPessoaModel, pessoaFiltro: any) {
    if (pessoas?.totalRegistros > LIMITE_TOTAL_REGISTRO) {
      pessoas.totalRegistros = LIMITE_TOTAL_REGISTRO;
      const alertConfig = {
        message: `Esta consulta retornou muitos registros, o resultado foi limitado a <b>${LIMITE_TOTAL_REGISTRO}</b> registros. Recomendamos que seja feito uma busca mais detalhada.`,
        duration: 10000,
        color: 'warning'
      };

      this.alertService.open(alertConfig);
    }
    let config = {
      data: {
        resultado: pessoas,
        filtro: pessoaFiltro
      },
      hasBackdrop: true
    };
    const modalRef: ModalRef = this.modalService.open(ModalListarProponenteComponent, config);
    modalRef.afterClosed().subscribe((resultado: any) => {
      if (resultado?.pessoaSelecionada) {
        let pessoa: PessoaModel = resultado?.pessoaSelecionada;
        this.store$.dispatch(new FindCapesSuccessAction(pessoa));
        this.valueChange.emit(pessoa);
      }
    });
  }

  retirarCaracteres(): string {
    const cpf = this.formulario.get('cpfCnpj').value;
    return cpf.replace(/\D/g, '');
  }

   /**
   * Verifica se data inicio é MENOR que data fim
   * atualiza o formControl para invalid se data for maior que data fim
   */
  validaPessoaEncontrada(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      if (!!this.formulario) {
        if ( this.pessoa === null ) {
          return {'cpfCnpjInvalida': this.translate.get('VALIDACAO.ERROR_PESSOA_NAO_ENCONTRADA')};
        }
      }
      return null;
    };
  }

  executarValidacao() {
    this.formulario.get('cpfCnpj').updateValueAndValidity();
  }

  public validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }



  get value() {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCb(v);
    }
  }

  writeValue(v: any): void {
    this.value = v;
  }

  registerOnChange(fn: any) {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isReadOnly = isDisabled;
  }

  onChangeCb: (_: any) => void = () => {
  };
  onTouchedCb: (_: any) => void = () => {
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeSelectedTipoFiltro() {
    switch (this.filtroSelecionando) {
      case 'cpfCnpj':
        this.isCpfCnpj = true;
        this.isApelido = false;
        this.isNomeRazaoSocial = false;
        this.placeHolder = this.getTranslate('CAPES_FILTRO.PLACEHOLDER.CPFCNPJ');
        this.formulario.get('cpfCnpj').clearValidators();
        this.formulario.get('cpfCnpj').setValidators(
          [
            Validators.required,
            this.validaPessoaEncontrada(),
            Validators.pattern("^(\\s*[0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2}\\s*)$|^(\\s*[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2}\\s*)$")
          ]
        );
        this.executarValidacao();
        break;

      case 'nomeRazaoSocial':
        this.isNomeRazaoSocial = true;
        this.isCpfCnpj = false;
        this.isApelido = false;
        this.placeHolder = this.getTranslate('CAPES_FILTRO.PLACEHOLDER.NOMERAZAOSOCIAL');
        this.formulario.get('cpfCnpj').clearValidators();
        this.formulario.get('cpfCnpj').setValidators(
          [
            Validators.required,
            this.validaPessoaEncontrada(),
            Validators.minLength(7)
          ]
        );
        this.executarValidacao();
        break;

      case 'apelido':
        this.isApelido = true;
        this.isCpfCnpj = false;
        this.isNomeRazaoSocial = false;
        this.placeHolder = this.getTranslate('CAPES_FILTRO.PLACEHOLDER.APELIDO');
        this.formulario.get('cpfCnpj').clearValidators();
        this.formulario.get('cpfCnpj').setValidators(
          [
            Validators.required,
            this.validaPessoaEncontrada(),
            Validators.minLength(7)
          ]
        );
        this.executarValidacao();
        break;
    }
  }

  handlerActionRow(pessoa: PessoaModel) {
    this.store$.dispatch(new FindCapesSuccessAction(pessoa));
    this.valueChange.emit(pessoa);
  }

  getTranslate(key: string): string {
    let valorTranslate = null;
    this.translate.get(key).subscribe(value => {
      valorTranslate = value;
    })
    return valorTranslate;
  }

}
