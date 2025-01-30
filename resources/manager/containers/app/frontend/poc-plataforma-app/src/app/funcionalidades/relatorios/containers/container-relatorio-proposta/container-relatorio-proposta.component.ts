import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { CustomAlertService } from '@app/shared/services/alert-custom.service';
import * as fromRelatorio from '../../reducers/relatorios.reducer';
import { Store, select } from '@ngrx/store';
import { LoadRelatorioProposta } from '../../actions/relatorios.actions';
import { Proposta } from '../../models/proposta.model';
import { Observable, Subscription } from 'rxjs';
import { SituacaoPropostaEnum } from '../../enums/SituacaoPropostaEnum';
import { ProdutoPropostaEnum } from '../../enums/ProdutoPropostaEnum';
import { CanalPropostaEnum } from '../../enums/CanalPropostaEnum';
import * as cpf from "@fnando/cpf";
import { Paginacao } from '@app/funcionalidades/faturamento/models/paginacao.model';
import { DatePipe } from '@angular/common';

import * as FileSaver from 'file-saver';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { TranslateService } from '@ngx-translate/core';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const CREATOR = 'SGR - Plataforma de Seguros';

@Component({
  selector: 'app-container-relatorio-proposta',
  templateUrl: './container-relatorio-proposta.component.html',
  styleUrls: ['./container-relatorio-proposta.component.css']
})
export class ContainerRelatorioPropostaComponent implements OnInit, OnDestroy  {

  form: FormGroup;
  propostas: Observable<Proposta[]>;
  paginacao$: Observable<Paginacao>;
  subscription: Subscription = new Subscription();

  situacaoProposta: Array<SituacaoPropostaEnum> = [
    SituacaoPropostaEnum.PENDENTE,
    SituacaoPropostaEnum.EM_ANALISE,
    SituacaoPropostaEnum.IMPLANTADA,
    SituacaoPropostaEnum.AGUARDANDO_PROCESSAMENTO,
    SituacaoPropostaEnum.RECUSADA,
    SituacaoPropostaEnum.CANCELADA
  ];

  produtoProposta: Array<ProdutoPropostaEnum> = [
    ProdutoPropostaEnum.VIDA_INDIVIDUAL,
    ProdutoPropostaEnum.VIDA_MULHER,
    ProdutoPropostaEnum.VIDA_SIMPLES,
    ProdutoPropostaEnum.RISCO_PREVI,
    ProdutoPropostaEnum.VIDA_EMPRESARIAL
  ];

  canalProposta: Array<CanalPropostaEnum> = [
    CanalPropostaEnum.SISBR,
    CanalPropostaEnum.SICOOBNET,
    CanalPropostaEnum.SIGAS
  ];

  constructor(private store$: Store<fromRelatorio.State>,
              private fb: FormBuilder,
              private translate: TranslateService
              ) { }

  ngOnInit() {
    this.carregarForm();
    this.form.controls.situacaoProposta.setValue(SituacaoPropostaEnum.PENDENTE);
    this.propostas = this.store$.pipe(select(fromRelatorio.getPropostas));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  consultar(formInstituicao: FormGroup, pagina?: number) {
    if (this.form.valid && (formInstituicao.valid || formInstituicao.disabled)) {
      const central = formInstituicao.get('central').value.idInstituicao;
      const coop =  this.montarCooperativas(formInstituicao);
      this.store$.dispatch(new LoadRelatorioProposta({...this.form.value, central: central, cooperativas: coop}, pagina));
      this.propostas = this.store$.pipe(select(fromRelatorio.getPropostas));
      this.paginacao$ = this.store$.pipe(select(fromRelatorio.getPaginacao));
    } else {
      this.validateAllFormFields(this.form);
      this.validateAllFormFields(formInstituicao);
    }
  }

  private montarCooperativas(formInstituicao: FormGroup) {
    const coop: Array<number> = [];
    if (formInstituicao.get('cooperativa').value === null && formInstituicao.value.listaCooperativas) {
      formInstituicao.value.listaCooperativas.map(cooperativa => {
        coop.push(cooperativa.idInstituicao);
      });
    }
    return coop;
  }

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

  gerarCSV() {
    let workbook = new Excel.Workbook();
    workbook.creator = CREATOR;
    workbook.created = new Date();
    var sheet = workbook.addWorksheet('Propostas');
    sheet.columns = [
      { header: 'Proposta', key: 'proposta', width: 15 },
      { header: 'Produto', key: 'produto', width: 32 },
      { header: 'CPF', key: 'CPF', width: 25},
      { header: 'Nome', key: 'nome', width: 50},
      { header: 'Canal de Venda', key: 'canal', width: 30},
      { header: 'Data da Situação', key: 'dataSituacao', width: 20, style: { numFmt: 'dd/mm/yyyy' }},
      { header: 'Situação', key: 'situacao', width: 50}
    ];
    let count = 0;
    this.propostas.subscribe(lista => {

      lista.forEach(proposta => {

        const row = sheet.addRow({proposta: proposta.proposta, produto: proposta.produto,
                                  CPF: proposta.cpfCnpj, nome: proposta.nomePessoa, canal: proposta.canalContratacao,
                                  dataSituacao: new DatePipe('pt-BR').transform(proposta.dataSituacao, 'dd/MM/yyyy'),
                                  situacao: proposta.situacao});
        row.font = { name: 'Arial', size: 12, bold: false };
        row.border = {};
        count++;
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      console.log('escrevendo arquivo excel...');
      this.saveAsExcelFile(data, "Propostas");
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });

      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  formatarCPF() {
    this.form.controls.cpfCnpj.setValue(cpf.format(this.form.controls.cpfCnpj.value));
  }

  retirarFormatoCPF() {
    this.form.controls.cpfCnpj.setValue(cpf.strip(this.form.controls.cpfCnpj.value));
  }

  setProposta(): Proposta {
    const retorno = new Proposta();

    retorno.pa = this.form.controls.pa.value;
    retorno.produto = this.form.controls.produto.value;
    retorno.dataInicio = this.form.controls.dataInicio.value;
    retorno.dataFim = this.form.controls.dataFim.value;
    retorno.cpfCnpj = this.form.controls.cpfCnpj.value;
    retorno.situacao = this.form.controls.situacaoProposta.value;

    return retorno;

  }

  private carregarForm() {
    this.form = this.fb.group({
      instituicao: ['', Validators.required],
      pa: ['' ],
      produto: ['' ],
      dataInicio: [new Date(), [
        this.validaDataInicioMenorDataFim()
      ]],
      dataFim: [new Date(), [
        this.validaDataFimMaiorDataInicio()
      ]],
      situacaoProposta: ['' ],
      canal: ['' ],
      cpfCnpj: ['', [Validators.minLength(11), Validators.maxLength(14)]]
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

  pageChanged(formInstituicao: FormGroup, $event: number) {
    this.consultar(formInstituicao, $event - 1);
  }

}
