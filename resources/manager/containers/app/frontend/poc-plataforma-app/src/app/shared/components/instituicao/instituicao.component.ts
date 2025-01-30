/* tslint:disable */
import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {InstituicaoService} from '@shared/services/instituicao.service';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '@sicoob/security';
import {UsuarioSicoob} from '@sicoob/security';
import {switchMap} from 'rxjs/operators';
import {InstituicaoModel} from '@app/models/instituicao.model';
import {Subscription} from 'rxjs';
import * as translate from 'assets/i18n/pt.json';

const ERROR_CONSULTA = 'Dados não encontrados';

@Component({
  selector: 'sc-instituicao',
  templateUrl: './instituicao.component.html',
  styleUrls: ['./instituicao.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InstituicaoComponent,
      multi: true
    }
  ]
})
export class InstituicaoComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() isReadOnly = false;

  @Input() labelCentral = translate.RELATORIOS.LABELS.CENTRAL;
  labelCoop = translate.RELATORIOS.LABELS.COOP;

  @Input() iniciarCooperativaDisabled: boolean;

  @Output() valueChange = new EventEmitter();

  @Input() coopRequerid = true;
  @Input() validarCentralCooperativaPeloUsuarioLogado: boolean;

  @Input() filterCentral: string[] = [];

  @Output() informarCooperativaSelecionada = new EventEmitter<any>();
  @Output() isCentralUsuarioLogado = new EventEmitter<any>();
  @Output() isUsuario0001Event = new EventEmitter<any>();
  @Input() limparCampos: Function;

  // objeto utilizado para desinscrever aos subscribe dos observable evitando vazamento de memoria
  private subscription = new Subscription();

  isSeguradora: boolean;

  // dados para os select do template para seleção de centrais e cooperativa
  centrais: InstituicaoModel[] = [];
  central: InstituicaoModel = {
    idInstituicao: 0,
    nome: '',
    numeroCooperativa: '',
    sigla: '',
    descricao: '',
    identificadorPai: 0,
    codigoGrauCooperativa: 0
  };
  cooperativas: InstituicaoModel[] = [];
  usuarioAut: UsuarioSicoob;

  // formulario
  formulario: FormGroup;

  // valor a ser retornado do component para o compoente pai
  private innerValue: any;

  // dados para controle do template do componente
  placeHolderCentral: string = 'Selecione uma Central';
  placeHolderCooperativa: string = 'Selecione uma Cooperativa';
  usuarioLogado: UsuarioSicoob;
  resultadoBuscaCentral: any;
  isUsuarioCentral: boolean = true;
  isUsuarioCooperativa: boolean;
  isUsuario0001 = false;

  constructor(private centralService: InstituicaoService,
              private authStore$: Store<fromAuth.State>,
              private cdf: ChangeDetectorRef,
              private fb: FormBuilder) {
  }

  ngOnInit() {

    this.formulario = this.fb.group({
      central: [{value: null, disabled: false}, Validators.required],
      cooperativa: [this.iniciarCooperativaDisabled == true ? {value: null, disabled: true} : {
        value: null,
        disabled: false
      }, this.coopRequerid ? Validators.required : null],
      listaCooperativas: []
    });

    this.buscarCentralPorCooperativa();
  }

  buscarCentralPorCooperativa() {
    this.authStore$.pipe(select(fromAuth.selectSicoobUser)).subscribe(resultado => {
      this.usuarioLogado = resultado;
    });
    if (this.usuarioLogado.numeroCooperativa == 1 && this.validarCentralCooperativaPeloUsuarioLogado == true) {
      this.isUsuario0001 = true;
      this.isUsuario0001Event.emit();
      this.formulario.get('central').setValidators([Validators.nullValidator]);
      this.consultaInstituicoes();
    } else if (this.usuarioLogado.numeroCooperativa != 1 && this.validarCentralCooperativaPeloUsuarioLogado == true) {
      this.centralService.buscarCentralPorCooperativa(this.usuarioLogado.numeroCooperativa).subscribe((res) => {
        this.resultadoBuscaCentral = res.resultado;
        if (this.validarCentralCooperativaPeloUsuarioLogado == true && this.resultadoBuscaCentral.numeroCooperativa != 1) {
          this.montarFormularioValidadoUsuarioCooperativa(this.resultadoBuscaCentral);
        }
      });
    } else {
      this.consultaInstituicoes();
    }
  }

  montarFormularioValidadoUsuarioCooperativa(resultado) {
    if (resultado.central) {
      this.centrais.push(<InstituicaoModel>{
        descricao: resultado.central.numeroCooperativa + ' - ' + resultado.central.nomeCooperativa,
        idInstituicao: resultado.central.idInstituicao,
        nome: resultado.central.nomeCooperativa,
        numeroCooperativa: resultado.central.numeroCooperativa,
        sigla: resultado.central.siglaCooperativa,
      });
      this.formulario.get('central').setValue(this.centrais[0]);
      this.formulario.get('central').disable();
      this.buscarCooperativas(resultado.numeroCooperativa, resultado.tipoCentral);
    } else if (!resultado.central) {
      this.isCentralUsuarioLogado.emit(this.formulario.get('cooperativa').value);
      this.centrais.push(<InstituicaoModel>{
        descricao: resultado.numeroCooperativa + ' - ' + resultado.nomeCooperativa,
        idInstituicao: resultado.idInstituicao,
        nome: resultado.nomeCooperativa,
        numeroCooperativa: resultado.numeroCooperativa,
        sigla: resultado.siglaCooperativa,
      });
      this.formulario.get('central').setValue(this.centrais[0]);
      this.formulario.get('central').disable();
      this.buscarCooperativas(resultado.numeroCooperativa, resultado.tipoCentral);
    }
  }

  setarCooperativa(numeroCooperativa) {
    this.cooperativas = this.cooperativas.filter((res) =>
      res.numeroCooperativa == numeroCooperativa
    );

    this.formulario.get('cooperativa').setValue(this.cooperativas[0].idInstituicao);
    this.formulario.get('cooperativa').disable();
  }


  /**
   * Consulta dados de centrais e cooperativas
   */
  private consultaInstituicoes() {
    this.subscription.add(
      this.authStore$.pipe(
        select(fromAuth.selectSicoobUser),
        switchMap(usuario => {
          this.usuarioAut = usuario;
          return this.centralService.buscarSeguradora((<any>usuario).idInstituicao || usuario.idInstituicaoOrigem);
        })
      ).subscribe(resultado => {
        this.isSeguradora = resultado.isSeguradora;
        this.centralService.buscarCentrais().subscribe(centraisResultado => {
          this.centrais = centraisResultado.centrais;
          this.centrais.push(<InstituicaoModel>{
            descricao: '756 - BANCO SICOOB S.A.',
            idInstituicao: 1,
            nome: 'BANCO SICOOB',
            numeroCooperativa: '1',
            sigla: 'BANCOOB'
          });

          this.obterCentral();
          this.filtrarCentrais();
          this.centrais.sort((a, b) => Number(a.numeroCooperativa) - Number(b.numeroCooperativa));
        });
      }, error => {
        this.placeHolderCentral = ERROR_CONSULTA;
        this.placeHolderCooperativa = ERROR_CONSULTA;
        this.cdf.markForCheck();
        return false;
      }, () => {
        this.cdf.markForCheck();
      }));
    return true;
  }

  private obterCentral() {
    if (!this.isSeguradora) {
      this.centralService.buscarHierarquiaSimples((<any>this.usuarioAut).idInstituicao || this.usuarioAut.idInstituicaoOrigem).subscribe(resultadoCentral => {
        if (resultadoCentral.codigoGrauCooperativa === 1) {
          /** Verifica se a instituicao é do tipo CENTRAL(1) */
          this.inicializaFormGroup();
          this.buscarCooperativas();
          this.cdf.markForCheck();
        } else {
          this.centrais.forEach(central => {
            if (central.idInstituicao === resultadoCentral.identificadorPai) {
              this.centrais = [];
              this.centrais.push(central);

              this.cooperativas = [];
              this.cooperativas.push(<InstituicaoModel>{
                idInstituicao: resultadoCentral.idInstituicao,
                descricao: resultadoCentral.numeroCooperativa + ' - ' + resultadoCentral.nome, // `${resultadoCentral.descricao}`,
                nome: resultadoCentral.nome,
                numeroCooperativa: resultadoCentral.numeroCooperativa,
                sigla: resultadoCentral.sigla,
                identificadorPai: resultadoCentral.identificadorPai,
                codigoGrauCooperativa: resultadoCentral.codigoGrauCooperativa
              });
              this.inicializaFormGroup();
              this.cdf.markForCheck();
              return;
            }
          });
        }
      });
    }
  }


  /**
   * Inicializa form group com os dados das centrais e cooperativas quando existir apenas um item
   * para que na tela o campo ja venha preenchido e desabilitado para alteração
   */
  private inicializaFormGroup() {
    if (this.centrais) {
      if (this.centrais.length === 1) {
        this.formulario.get('central').setValue(this.centrais[0]);
        this.formulario.get('central').disable();
      } else {
        if (!(this.usuarioAut.numeroCooperativa === 300 || this.usuarioAut.numeroCooperativa === 1)) {
          if (this.centrais.some(x => x.numeroCooperativa === this.usuarioAut.numeroCooperativa.toString())) {
            this.formulario.get('central').setValue(this.centrais.find(y => y.numeroCooperativa === this.usuarioAut.numeroCooperativa.toString()));
            this.formulario.get('central').disable();
          }
        }
      }
    }
    if (this.cooperativas && this.cooperativas.length === 1) {
      this.formulario.controls.listaCooperativas.setValue(this.cooperativas);
      this.formulario.get('cooperativa').setValue(this.cooperativas[0].idInstituicao);
      this.formulario.get('cooperativa').disable();
      this.value = this.formulario.get('cooperativa').value;
    }
  }

  /**
   * Busca as cooperativas pelo id da central selecionada
   */
  buscarCooperativas(numcoop?: string, isCentral?: boolean) {
    if (!this.formulario.get('central').invalid) {
      this.subscription.add(
        this.centralService.buscarCooperativas(this.formulario.get('central').value.idInstituicao).subscribe(resultado => {
          if (this.formulario.get('central').value.idInstituicao === 1) {
            this.cooperativas = [];
            this.cooperativas.push(<InstituicaoModel>{
              descricao: '0001 - BANCO COOPERATIVO DO BRASIL',
              idInstituicao: 1,
              nome: 'BANCO COOPERATIVO DO BRASIL',
              numeroCooperativa: '0001',
              sigla: 'BANCOOB'
            });
            if (this.iniciarCooperativaDisabled) {
              this.formulario.get('cooperativa').enable();
            }
          } else {
            if (this.iniciarCooperativaDisabled) {
              this.formulario.get('cooperativa').enable();
            }
            this.cooperativas = resultado;
          }
          this.formulario.controls.listaCooperativas.setValue(this.cooperativas);
          this.formulario.get('cooperativa').reset();

          if (this.iniciarCooperativaDisabled) {
            this.formulario.get('cooperativa').enable();
          }
          this.cdf.markForCheck();
          if (this.validarCentralCooperativaPeloUsuarioLogado == true && isCentral == false) {
            this.setarCooperativa(numcoop);
          }

          this.cooperativas.sort((a, b) => Number(a.numeroCooperativa) - Number(b.numeroCooperativa));

        }, error => {
          this.cooperativas = [];
          this.formulario.get('cooperativa').reset();
          this.placeHolderCooperativa = ERROR_CONSULTA;
          this.cdf.markForCheck();
        }, () => {
          this.cdf.markForCheck();
        }));
    } else {
      this.formulario.get('cooperativa').reset();
      this.formulario.get('cooperativa').markAsTouched();
      this.cooperativas = [];
    }
  }

  atualizaValorComponente(valor) {
    this.informarCooperativaSelecionada.emit(this.formulario.get('cooperativa').value);

    if (valor && (valor !== this.innerValue)) {
      this.value = valor;
      this.valueChange.emit(valor);
    } else if (!this.coopRequerid) {
      this.value = this.formulario.get('central').value ? this.formulario.get('central').value.idInstituicao : '';
    } else {
      this.value = '';
    }
  }

  filtrarCentrais() {
    if (this.filterCentral && this.filterCentral.length > 0) {
      this.centrais = this.centrais.filter(central => this.filterCentral.some(x => x === central.numeroCooperativa));
    }
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
}
