import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Corretora } from '@app/models/corretora.model';
import { VinculoCorretoraCooperativa } from '@app/models/vinculoCorretoraCooperativa.model';
import { Store, select } from '@ngrx/store';
import * as fromInstituicao from '@sicoob/lib-seguros';
import { InstituicaoModel, LoadCentraisAction } from '@sicoob/lib-seguros';
import * as fromAuth from '@sicoob/security';
import { UsuarioSicoob } from '@sicoob/security';
import { MODAL_DATA, ModalRef, ModalService } from '@sicoob/ui';
import { Observable, Subscription } from 'rxjs';
import { CleanCorretora, FindCorretora, ValidateCooperativa } from '../../actions/corretoras.actions';
import { CorretorasService } from '../../corretoras.service';
import { Corretoras } from '../../models/corretoras.model';
import * as fromCorretoras from '../../reducers/corretoras.reducer';
import { ModalNomeCorretoraComponent } from '../modal-nome-corretora/modal-nome-corretora.component';
import { InstituicaoSimples } from '@app/models/instituicaoSimples.model';

@Component({
  selector: 'app-modal-inclusao-vinculo',
  templateUrl: './modal-inclusao-vinculo.component.html',
  styleUrls: ['./modal-inclusao-vinculo.component.scss']
})
export class ModalInclusaoVinculoComponent implements OnInit, OnDestroy {

  form: FormGroup;
  centrais$: Observable<InstituicaoModel[]>;
  cooperativas$: Observable<InstituicaoModel[]>;
  instituicoes$: Observable<InstituicaoSimples[]>
  usuarioLogado: UsuarioSicoob;
  cooperativa : number;
  numeroSusep : number;
  nomeCorretora : string;
  vinculo : VinculoCorretoraCooperativa;
  existeVinculo: boolean;
  subscriptionValidar: Subscription;
  subscriptionNome: Subscription;
  subscriptionForm: Subscription;

  constructor(
    public modalRef: ModalRef, // Passar parametros ao fechar no modalRef.close({nome: 'test'})
    private fb: FormBuilder,
    private authStore$: Store<fromAuth.State>,
    @Inject(MODAL_DATA) public data: Corretoras,
    private corretorasService : CorretorasService,
    private instituicaoStore$: Store<fromInstituicao.State>,
    private modalService: ModalService,
    private store: Store<fromCorretoras.State>,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      instituicao: [''],
      central: ['', Validators.required],
      cooperativa: [''],
      numeroSusep: ['', [Validators.required, Validators.pattern(/\d/g)]],
    });
    this.vinculo = null;
    this.authStore$.pipe(select(fromAuth.selectSicoobUser)).subscribe(resultado => {
      this.usuarioLogado = resultado;
    });
    this.centrais$ = this.instituicaoStore$.pipe(select(fromInstituicao.getCentrais));
    this.instituicaoStore$.dispatch(new LoadCentraisAction());

    this.subscriptionForm = this.form.valueChanges.subscribe((formValue) => {
      const centralControl = this.form.get('central');
      const cooperativaControl = this.form.get('cooperativa');
      const instituicaoControl = this.form.get('instituicao');

      if (formValue.instituicao) {
        this.toggleControl(centralControl, true, false);
        this.toggleControl(cooperativaControl, true, false);
      } else {
        this.toggleControl(centralControl, false, true);
        this.toggleControl(cooperativaControl, false, true);
      }

      if (formValue.central) {
        this.toggleControl(instituicaoControl, true, false);
      } else {
        this.toggleControl(instituicaoControl, false, true);
      }
    });
  }

  ngAfterViewInit(): void {
    this.centrais$ = this.corretorasService.carregarCentrais();
    this.instituicoes$ = this.corretorasService.carregarInstituicoes();
    this.subscriptionValidar = this.store.pipe(select(fromCorretoras.getValidar)).subscribe((prop:VinculoCorretoraCooperativa) => {

      if (prop != null) {
        prop != null && prop.idCooperativa != 0 ? this.existeVinculo = true : this.existeVinculo = false;
        this.montarDadosVinculo();
      }
    });

    this.subscriptionNome = this.store.pipe(select(fromCorretoras.getCorretora)).subscribe((cor: Corretora) => {
      this.nomeCorretora = cor ? cor.nomeCorretora : undefined;
      if (this.nomeCorretora != undefined) {
        this.abrirModalNome();
      }
    })
  }

  ngOnDestroy(){
    this.store.dispatch(new CleanCorretora());
    this.form.reset();
    this.fechar();
  }

  abrirModalNome(){
    if( this.nomeCorretora !== undefined && this.nomeCorretora !== "") {
      this.modalService.open(ModalNomeCorretoraComponent, {
        data: {
          vinculo : this.vinculo,
          nomeCorretora : this.nomeCorretora,
          existeVinculo : this.existeVinculo
        }
      }).afterClosed().subscribe((param: any) => {
        this.vinculo = null;
        this.nomeCorretora = "";
        if (param?.resultado) {
          this.store.dispatch(new CleanCorretora());
          this.fechar();
        }
      });
    }
  }

  buscarCooperativasPorIdCentral() {
    const central: string = this.form.value.central;

    if (this.validaValueCentral(central)) {
      this.carregarCooperativas(central);
    } else {
      this.handleEmptyCentral();
    }
  }

  validaValueCentral(central: string): boolean {
    return central && central.length > 0;
  }

  handleEmptyCentral() {
    this.cooperativas$ = null;
    this.resetarCooperativaForm();
  }

  carregarCooperativas(idCentral: string) {
    this.cooperativas$ = this.corretorasService.carregarCooperativasPorIdCentral(Number(idCentral));
  }

  resetarCooperativaForm() {
    this.form.get('cooperativa').reset();
  }

  adicionarVinculo() {
    if (this.form.valid) {
      const instituicao = this.obterValorInstituicao();
      this.store.dispatch(new ValidateCooperativa(instituicao, this.form.value.numeroSusep));
    } else {
      this.form.markAllAsTouched();
    }
  }

  montarDadosVinculo() {
    const instituicao = this.obterValorInstituicao();

    if (this.form.value.numeroSusep.length > 13) {
      this.vinculo = {
        numeroSusep : null,
        cnpj : this.form.value.numeroSusep,
        usuario : this.usuarioLogado.login,
        idInstituicao : instituicao,
        idCooperativa: 0
      }
    } else {
      this.vinculo = {
        numeroSusep : this.form.value.numeroSusep,
        cnpj : null,
        usuario : this.usuarioLogado.login,
        idInstituicao : instituicao,
        idCooperativa: 0
      }
    }
    this.obterNomeCorretora();
  }

  obterNomeCorretora() {
    var parametro = this.vinculo.numeroSusep !== undefined && this.vinculo.numeroSusep !== "" && this.vinculo.numeroSusep !== null ? this.vinculo.numeroSusep : this.vinculo.cnpj
    if (parametro !== undefined && parametro !== null) {
      this.store.dispatch(new FindCorretora(parametro));
    }
  }

  fechar() {
    this.subscriptionValidar.unsubscribe();
    this.subscriptionNome.unsubscribe();
    this.subscriptionForm.unsubscribe();
    this.modalRef.close();
  }

  private obterValorInstituicao(): number {
    const { cooperativa = null, central = null, instituicao = null } = this.form.value ?? {};
    return cooperativa || central || instituicao
  }

  private toggleControl(control: AbstractControl, disable: boolean, enable: boolean) {
    if (disable && !control.disabled) {
      control.disable({ emitEvent: false });
    } else if (enable && control.disabled) {
      control.enable({ emitEvent: false });
    }

    if (disable) {
      control.clearValidators();
    } else if (enable) {
      control.setValidators([Validators.required]);
      this.form.controls['cooperativa'].clearValidators();
    }

    control.updateValueAndValidity({ emitEvent: false });
  }

}
