import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import * as cpf from "@fnando/cpf";
import { Observable, Subscription } from 'rxjs';
import { Proposta } from '../../models/proposta.model';
import { SituacaoPropostaEnum } from '../../enums/SituacaoPropostaEnum';
import { ProdutoPropostaEnum } from '../../enums/ProdutoPropostaEnum';
import { CanalPropostaEnum } from '../../enums/CanalPropostaEnum';
import { MsgErrorEnum } from '@app/shared/enum/message.enum';
import { Color, ModalService } from '@sicoob/ui';
import { CustomAlertService } from '@app/shared/services/alert-custom.service';
import { select, Store } from '@ngrx/store';
import * as fromRelatorio from '../../reducers/relatorios.reducer';
import { LoadRelatorioPropostaVenda } from '../../actions/relatorios.actions';
import { Paginacao } from '@app/funcionalidades/faturamento/models/paginacao.model';
import { ModalMotivoRelatorioComponent } from '../../components/modal-motivo-relatorio/modal-motivo-relatorio.component';
import { InstituicaoModel } from '@app/models/instituicao.model';

import * as FileSaver from 'file-saver';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const CREATOR = 'SGR - Plataforma de Seguros';


@Component({
  selector: 'app-container-relatorio-venda',
  templateUrl: './container-relatorio-venda.component.html',
  styleUrls: ['./container-relatorio-venda.component.scss']
})
export class ContainerRelatorioVendaComponent implements OnInit, OnDestroy  {

  form: FormGroup;
  propostasVenda: Observable<Proposta[]>;
  propostasVendaCsv: Proposta[];
  subscription: Subscription = new Subscription();
  paginacaoVenda$: Observable<Paginacao>;
  cooperativas: InstituicaoModel[];

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

  @ViewChild('formInstituicao')
  formInst;

  constructor(private fb: FormBuilder,
              private readonly alertService: CustomAlertService,
              private store$: Store<fromRelatorio.State>,
              private readonly modalService: ModalService,
              private translate: TranslateService) { }

  ngOnInit() {
    this.carregarForm();
    this.propostasVenda = this.store$.pipe(select(fromRelatorio.getPropostasVenda));
    this.consultar(this.formInst, 0);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  formatarCPF() {
    this.form.controls.cpfSegurado.setValue(cpf.format(this.form.controls.cpfSegurado.value));
  }

  retirarFormatoCPF() {
    this.form.controls.cpfSegurado.setValue(cpf.strip(this.form.controls.cpfSegurado.value));
  }

  consultar(formInstituicao: FormGroup, pagina?: number) {
    if (this.form.valid && (formInstituicao.valid || formInstituicao.disabled)) {
      const central = formInstituicao.get('central').value.idInstituicao;
      const coop =  this.montarCooperativas(formInstituicao);
      this.store$.dispatch(new LoadRelatorioPropostaVenda({...this.form.value, central: central, cooperativas: coop}, pagina));
      this.propostasVenda = this.store$.pipe(select(fromRelatorio.getPropostasVenda));
      this.paginacaoVenda$ = this.store$.pipe(select(fromRelatorio.getPaginacaoVenda));
    } else {
      this.validateAllFormFields(this.form);
      this.validateAllFormFields(formInstituicao);
    }
  }

  consultarCsv(formInstituicao: FormGroup, pagina?: number) {
    if (this.form.valid && (formInstituicao.valid || formInstituicao.disabled)) {
      const central = formInstituicao.get('central').value.idInstituicao;
      const coop =  this.montarCooperativas(formInstituicao);
      this.store$.dispatch(new LoadRelatorioPropostaVenda({...this.form.value, central: central, cooperativas: coop}, pagina));
      this.store$.pipe(select(fromRelatorio.getPropostasVenda)).subscribe(lista => {
        if (lista.length !== 0) {
          this.propostasVendaCsv = lista;
          this.gerarCSV();
        }
      });
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
    if (formGroup && formGroup.controls) {
      Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({onlySelf: true});
        } else if (control instanceof FormGroup || control instanceof FormArray) {
          this.validateAllFormFields(control);
        }
      });
    }
  }


  gerarCSV() {
    let workbook = new Excel.Workbook();
    workbook.creator = CREATOR;
    workbook.created = new Date();
    var sheet = workbook.addWorksheet('Propostas de Vendas');
    sheet.columns = [
      { header: 'Proposta', key: 'proposta', width: 15 },
      { header: 'Produto', key: 'produto', width: 32 },
      { header: 'Situação', key: 'situacao', width: 50},
      { header: 'Data da Situação', key: 'dataSituacao', width: 20, style: { numFmt: 'dd/mm/yyyy' }},
      { header: 'Cooperativa', key: 'cooperativa', width: 10},
      { header: 'PA', key: 'pa', width: 10},
      { header: 'Data da Venda', key: 'dataVenda', width: 15},
      { header: 'CPF', key: 'CPF', width: 25},
      { header: 'Nome', key: 'nome', width: 50},
      { header: 'Periodicidade', key: 'periodicidade', width: 15},
      { header: 'Prêmio', key: 'premio', width: 10},
      { header: 'Prêmio Mensal', key: 'premioMensal', width: 10},
      { header: 'Capital Segurado', key: 'capitalSegurado', width: 10},
      { header: 'CPF do Vendedor', key: 'cpfVendedor', width: 15},
      { header: 'Canal de Venda', key: 'canal', width: 30},
    ];
    let count = 0;
    this.propostasVendaCsv.map(proposta => {

        const row = sheet.addRow({proposta: proposta.proposta,
                                  produto: proposta.produto,
                                  situacao: proposta.situacao,
                                  dataSituacao: new DatePipe('pt-BR').transform(proposta.dataSituacao, 'dd/MM/yyyy'),
                                  cooperativaPA: proposta.cooperativa,
                                  pa: proposta.pa,
                                  dataVenda: proposta.dataVenda,
                                  CPF: proposta.cpfCnpj,
                                  nome: proposta.nomePessoa,
                                  periodicidade: proposta.periodicidade,
                                  premio: proposta.valorPremio,
                                  premioMensal: proposta.valorPremioMensal,
                                  capitalSegurado: proposta.valorCapitalSegurado,
                                  cpfVendedor: proposta.cpfVendedor,
                                  canal: proposta.canalContratacao,
                                  });
        row.font = { name: 'Arial', size: 12, bold: false };
        row.border = {};
        count++;

    });

    workbook.xlsx.writeBuffer().then((data) => {
      console.log('escrevendo arquivo excel...');
      this.saveAsExcelFile(data, "Propostas Vendas");
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });

    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}

  private carregarForm() {
    this.form = this.fb.group({
      instituicao: ['', Validators.required],
      pontoAtendimento: ['' ],
      produto: ['' ],
      dataInicio: [new Date(), [
        this.validaDataInicioMenorDataFim()
      ]],
      dataFim: [new Date(), [
        this.validaDataFimMaiorDataInicio()
      ]],
      dataCancelamento: ['' ],
      situacaoProposta: ['' ],
      canal: ['' ],
      cpfCnpj: ['', [Validators.minLength(11), Validators.maxLength(14)]]
    });
  }

  pageChanged(formInstituicao: FormGroup, $event: number) {
    this.consultar(formInstituicao, $event - 1);
  }

  retornarSituacao(venda:Proposta) {
    return venda.situacao;
  }

  verificarSituacao(venda: Proposta) {
    if (venda.situacao === 'Cancelada') {
      return 'situacao-cancelada';
    } else if (venda.situacao === 'Pendente') {
      return 'situacao-pendente';
    }
    return 'situacao-success';
  }

  exibirMotivo(venda: Proposta) {
    if (venda.situacao === 'Cancelada') {
      this.modalService.open(ModalMotivoRelatorioComponent, {data: {venda, titulo: "Cancelamento"}});
    } else if (venda.situacao === 'Pendente') {
      this.modalService.open(ModalMotivoRelatorioComponent, {data: {venda, titulo: "Pendente"}});
    }
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

}
