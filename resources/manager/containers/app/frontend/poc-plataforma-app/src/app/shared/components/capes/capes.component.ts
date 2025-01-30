import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, Inject, Injectable } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, Validators, ValidatorFn, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import * as fromAuth from '@sicoob/security';
import * as fromCapes from './reducers/capes.reducer';
import { Store, select } from '@ngrx/store';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import { TranslateService } from '@ngx-translate/core';
import { FindCapesAction, CleanCapesAction } from './actions/capes.actions';
import { UsuarioSicoob } from '@sicoob/security';


const ERROR_CONSULTA = 'Dados não encontrados';

@Component({
  selector: 'sc-capes-cpf-cnpj',
  templateUrl: './capes.component.html',
  styleUrls: ['./capes.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CapesComponent,
      multi: true
    }
  ]
})
export class CapesComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() labelCpfCnpj = 'Cpf / Cnpj';

  @Input() placeHolder = 'Digite o Cpf ou Cnpj';

  @Output() valueChange = new EventEmitter();

  @Input() isReadOnly = true;

  private innerValue: any;
  private subscription = new Subscription();

  pessoa: Observable<PessoaModel>;
  formulario: FormGroup;
  dadosRetorno: string = '';
  usuario: UsuarioSicoob;


  constructor(private store$: Store<fromCapes.State>,
              private authStore$: Store<fromAuth.State>,
              private cdf: ChangeDetectorRef,
              private fb: FormBuilder,
              private translate: TranslateService) { }

  ngOnInit() {
    this.store$.dispatch(new CleanCapesAction());
    this.authStore$.pipe(select(fromAuth.selectSicoobUser)).subscribe(resultado => {
      this.usuario = resultado;
    });
    this.formulario = this.fb.group({
      cpfCnpj: ['', [Validators.required, this.validaPessoaEncontrada(), Validators.pattern("^(\\s*[0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2}\\s*)$|^(\\s*[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2}\\s*)$")]],
    });
    this.pessoa = this.store$.pipe(select(fromCapes.getCapes));
  }

  consultarPessoas(event) {
    if (event.keyCode === 13) {
      this.consultarPessoa();
    }
  }

  public consultarPessoa() {
    if(this.formulario.valid) {
      this.cdf.markForCheck();
      this.store$.dispatch(new FindCapesAction(
        {cpfCnpj: this.retirarCaracteres(),
        idInstituicao: (<any>this.usuario).idInstituicao || this.usuario.idInstituicaoOrigem}));
    }
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

}
