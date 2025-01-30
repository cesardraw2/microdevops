import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {SituacaoPlurianualEnum} from '../../models/situacao-plurianual-enum.model';
import * as fromRelatorioAuto from '../../reducers/relatorio-auto.reducer';
import {ClearRelatorioAutos, LoadRelatorioPlurianual} from '@funcionalidades/relatorio-auto/actions/relatorio-auto.actions';
import {ConsultaRelatorioPlurianualModel} from '@funcionalidades/relatorio-auto/models/consulta-relatorio-plurianual.model';
import {Observable} from 'rxjs';
import {DadosRelatorioPlurianual, RelatorioPlurianualModel} from '@funcionalidades/relatorio-auto/models/relatorio-plurianual.model';
import {RelatorioAutoService} from '@funcionalidades/relatorio-auto/relatorio-auto.service';
import {TranslateService} from '@ngx-translate/core';

import * as FileSaver from 'file-saver';
import {DatePipe} from '@angular/common';
import {EnumPipe} from '@shared/pipes/enums.pipe';
import {InstituicaoModel} from '@app/models/instituicao.model';
import * as fromAuth from '@sicoob/security';
import {UsuarioSicoob} from '@sicoob/security';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

declare const ExcelJS: any;

@Component({
  selector: 'sc-container-relatorio-auto',
  templateUrl: './container-relatorio-auto.component.html',
  styleUrls: ['./container-relatorio-auto.component.css'],
  providers: [
    EnumPipe
  ]
})
export class ContainerRelatorioAutoComponent implements OnInit {

  // workbook: ExcelJsS

  formRelatorioAuto: FormGroup;
  relatorio: Observable<RelatorioPlurianualModel>;
  resultadoConsulta: Array<DadosRelatorioPlurianual> = [];
  paginacao: any = {};
  usuarioAut: UsuarioSicoob;

  situacaoPlurianual = Object.keys(SituacaoPlurianualEnum);
  qtdItensPorPagina = 50;

  dataInicioCalendario: Date = new Date();
  dataFimCalendario: Date = new Date();

  central;
  cooperativas;
  /** Lista de cooperativas para usar no CSV */
  listaCooperativas;

  constructor(
    private formBuilder: FormBuilder,
    private store$: Store<fromRelatorioAuto.State>,
    private relatorioAutoService: RelatorioAutoService,
    private translate: TranslateService,
    private enumPipe: EnumPipe,
    private authStore$: Store<fromAuth.State>
  ) {
    this.dataInicioCalendario.setDate(this.dataInicioCalendario.getDate() - 90);
    this.formRelatorioAuto = this.formBuilder.group({
      instituicao: [{}, Validators.required],
      pontoAtendimento: ['', [this.validarPa()]],
      dataInicio: [this.dataInicioCalendario, [
        this.validaDataInicioMenorDataFim()
      ]],
      dataFim: [this.dataFimCalendario, [
        this.validaDataFimMaiorDataInicio()
      ]],
      situacao: ['']
    });
  }

  ngOnInit() {
  }

  /**
   * reflesh nos campos de data, atualizando valores e suas devidas validações;
   */
  atualizaValidacaoData() {
    this.formRelatorioAuto.get('dataFim').updateValueAndValidity();
    this.formRelatorioAuto.get('dataInicio').updateValueAndValidity();
  }

  consultarRelatorio(formInstituicao: FormGroup, pagina?: number) {
    if (this.formRelatorioAuto.valid && (formInstituicao.valid || formInstituicao.disabled)) {
      this.central = formInstituicao.get('central').value;
      this.cooperativas = this.montarCooperativas(formInstituicao);
      const pa = this.formRelatorioAuto.value.pontoAtendimento;
      const consulta: ConsultaRelatorioPlurianualModel = {
        idCooperativas: this.cooperativas,
        pa: pa != null && pa !== '' ? Number(pa) : null,
        dataInicio: this.formRelatorioAuto.value.dataInicio,
        dataFim: this.formRelatorioAuto.value.dataFim,
        situacao: this.formRelatorioAuto.value.situacao,
        pagina: pagina ? pagina : 0,
        tamanhoPagina: this.qtdItensPorPagina
      };

      // Volta o store do relatorio pro estado inicial
      this.store$.dispatch(new ClearRelatorioAutos());
      this.resultadoConsulta = [];

      // Realiza a consulta
      this.store$.dispatch(new LoadRelatorioPlurianual(consulta));
      this.relatorio = this.store$.pipe(select(fromRelatorioAuto.getRelatorioPlurianual));
      this.relatorio.subscribe(response => {
        if (response) {
          if (response.resultado && response.resultado.length > 0) {
            this.resultadoConsulta = response.resultado;
          } else {
            this.resultadoConsulta = [];
          }
          if (response.paginacao) {
            this.paginacao = response.paginacao;
          }
        }
      });
    }
  }

  private montarCooperativas(formInstituicao: FormGroup) {
    const coop: Array<number> = [];
    if (formInstituicao.get('cooperativa').value) {
      coop.push(formInstituicao.get('cooperativa').value);
    } else if (formInstituicao.get('cooperativa').value === null && formInstituicao.value.listaCooperativas.length > 1) {
      formInstituicao.value.listaCooperativas.map(cooperativa => {
        coop.push(cooperativa.idInstituicao);
      });
    }
    this.listaCooperativas = formInstituicao.value.listaCooperativas;
    return coop;
  }

  /**
   * Verifica se data inicio é MENOR que data fim
   * atualiza o formControl para invalid se data for maior que data fim
   */
  private validaDataInicioMenorDataFim(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      if (!!this.formRelatorioAuto) {
        // tslint:disable-next-line:max-line-length
        if (control.value > this.formRelatorioAuto.get('dataFim').value || (!control.value && this.formRelatorioAuto.get('dataFim').value)) {
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
  private validaDataFimMaiorDataInicio(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      if (!!this.formRelatorioAuto) {
        if (control.value < this.formRelatorioAuto.get('dataInicio').value) {
          return {'DataFimInvalida': this.translate.get('VALIDACAO.ERROR_DATA_FINAL_MENOR_DATA_FINAL')};
        }
      }
      return null;
    };
  }

  pageChanged(formInstituicao: FormGroup, $event: number) {
    this.consultarRelatorio(formInstituicao, $event - 1);
  }

  async gerarCSV() {
    console.log('Entrou no GerarCSV');

    let csv = '';

    /** header do csv */
    // tslint:disable-next-line:max-line-length
    csv += 'Central;Cooperativa;PA;Data Operacao;Prazo;Proposta Seg;Segurado;CPF;N do Boleto;Valor Premio;Data Pag;Situação;\n';

    /** Inserindo as linhas da tabela */
    this.relatorio.subscribe((lista: RelatorioPlurianualModel) => {
      lista.resultado.forEach((dado: DadosRelatorioPlurianual) => {
        const tempCooperativa: InstituicaoModel = this.listaCooperativas
          .find((coop: InstituicaoModel) => coop.idInstituicao === dado.idInstituicao);
        const numPaTemp = dado.idPa || dado.idPa === 0 ? dado.idPa.toString() : '';
        // tslint:disable-next-line:max-line-length
        csv += `"${this.central.numeroCooperativa + ' - ' + this.central.sigla}";"${tempCooperativa.numeroCooperativa + ' - ' + tempCooperativa.sigla}";"${numPaTemp + ' - ' + (dado.nomePa || '')}";"${new DatePipe('pt-BR').transform(dado.dataOperacao, 'dd/MM/yyyy') || ''}";"${dado.prazo || ''}";"${dado.proposta || ''}";"${dado.segurado || ''}";"${dado.cpfCnpj || ''}";"${dado.boleto || ''}";"${dado.valorPremio || ''}";"${new DatePipe('pt-BR').transform(dado.dataPagamento, 'dd/MM/yyyy') || ''}";"${this.enumPipe.transform(dado.situacao, 'TIPO_SITUACAO_PLURIANUAL_RELATORIO') || ''}";`;
        /** pular linha */
        csv += '\n';
      });
    });

    let blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv; charset=utf-8'
    });

    FileSaver.saveAs(blob, 'relatorio_plurianual_auto' + '_export_' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.csv');

    // let link = document.createElement('a');
    // link.href =  encodeURI('data:text/csv;charset=utf-8,' + csv);
    // link.target = '_blank';
    // link.download = 'relatorio_plurianual_auto' + '_export_' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.csv';
    // link.click();

    // let workbook = new Excel.Workbook();
    // workbook.creator = 'SGR - Plataforma de Seguros';
    // workbook.created = new Date();
    // let sheet = workbook.addWorksheet('Propostas plurianual');
    // sheet.columns = [
    //   {header: 'Central', key: 'central', width: 35},
    //   {header: 'Cooperativa', key: 'cooperativa', width: 15},
    //   {header: 'PA', key: 'descPa', width: 25},
    //   {header: 'Data Operação', key: 'dataOperacao', width: 15, style: {numFmt: 'dd/mm/yyyy'}},
    //   {header: 'Nº Op. Crédito', key: 'operacaoCredito', width: 25},
    //   {header: 'Prazo', key: 'prazo', width: 10},
    //   {header: 'Proposta Seg', key: 'proposta', width: 25, style: {numFmt: '0'}},
    //   {header: 'Segurado', key: 'segurado', width: 25},
    //   {header: 'CPF', key: 'cpfCnpj', width: 20},
    //   {header: 'Nº do Boleto', key: 'boleto', width: 25},
    //   {header: 'Valor Prêmio', key: 'valorPremio', width: 20},
    //   {header: 'Data Pag', key: 'dataPagamento', width: 15, style: {numFmt: 'dd/mm/yyyy'}},
    //   {header: 'Status', key: 'situacao', width: 25}
    // ];
    //
    // let row = null;
    // this.relatorio.subscribe((lista: RelatorioPlurianualModel) => {
    //   lista.resultado.forEach((dado: DadosRelatorioPlurianual) => {
    //     const tempCooperativa: InstituicaoModel = this.listaCooperativas
    //       .find((coop: InstituicaoModel) => coop.idInstituicao === dado.idInstituicao);
    //     row = sheet.addRow({
    //       central: this.central.numeroCooperativa + ' - ' + this.central.sigla,
    //       cooperativa: tempCooperativa.numeroCooperativa + ' - ' + tempCooperativa.sigla,
    //       descPa: (dado.idPa || '') + ' - ' + (dado.nomePa || ''),
    //       dataOperacao: new DatePipe('pt-BR').transform(dado.dataOperacao, 'dd/MM/yyyy'),
    //       operacaoCredito: dado.operacaoCredito,
    //       prazo: dado.prazo,
    //       proposta: dado.proposta,
    //       segurado: dado.segurado,
    //       cpfCnpj: dado.cpfCnpj,
    //       boleto: dado.boleto,
    //       valorPremio: dado.valorPremio,
    //       dataPagamento: new DatePipe('pt-BR').transform(dado.dataPagamento, 'dd/MM/yyyy'),
    //       situacao: this.enumPipe.transform(dado.situacao, 'TIPO_SITUACAO_PLURIANUAL_RELATORIO')
    //     });
    //     row.font = {name: 'Arial', size: 12, bold: false};
    //     row.border = {};
    //   });
    // });
    // workbook.xlsx.writeBuffer().then((data) => {
    //   console.log('escrevendo arquivo excel...');
    //
    //   const dataBlob: Blob = new Blob([data], { type: EXCEL_TYPE });
    //   FileSaver.saveAs(dataBlob, 'relatorio_plurianual_auto' + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    // });
  }

  private validarPa(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      if (!!this.formRelatorioAuto) {
        if (control.value < 0) {
          return {'PaNegativo': this.translate.get('VALIDACAO.PA_COM_NUMERO_NEGATIVO')};
        }
        if (control.value > 9999) {
          return {'PaAcimaDoPermitido': this.translate.get('VALIDACAO.PA_COM_NUMERO_ACIMA_DE_9999')};
        }
      }
      return null;
    };
  }

  verificaBancoob() {
    let centraisPermitidas = [];
    this.authStore$.pipe(
      select(fromAuth.selectSicoobUser),
    ).subscribe(x => {
      if (x.numeroCooperativa === 300 || x.numeroCooperativa === 1) {
        centraisPermitidas = [
          '1001', '1002', '1003', '1004', '1005', '1006', '1007', '2001',
          '2003', '2005', '2007', '2008', '2009', '2013', '2015', '2016'
        ];
      }
    });
    return centraisPermitidas;
  }

  identaNrBoleto(nrBoleto) {
    if (nrBoleto && nrBoleto.length >= 22) {
      const parte1 = nrBoleto.substring(0, 22); // Primeiros 22 caracteres
      const parte2 = nrBoleto.substring(22);    // Restante do texto

      return parte1 + ' ' + parte2;
    }
  }
}
