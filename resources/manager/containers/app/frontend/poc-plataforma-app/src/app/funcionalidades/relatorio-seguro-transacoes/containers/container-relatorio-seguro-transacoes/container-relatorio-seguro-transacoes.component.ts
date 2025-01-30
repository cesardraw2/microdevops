import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {EnumPipe} from '@shared/pipes/enums.pipe';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '@sicoob/security';
import {RelatorioPlurianualModel} from '@funcionalidades/relatorio-auto/models/relatorio-plurianual.model';
import {Observable} from 'rxjs';
import * as FileSaver from 'file-saver';
import {TranslateService} from '@ngx-translate/core';
import {
  RelatorioSeguroTransacoesService
} from '@funcionalidades/relatorio-seguro-transacoes/relatorio-seguro-transacoes.service';
import {CustomAlertService} from '@shared/services/alert-custom.service';

@Component({
  selector: 'sc-container-relatorio-seguro-celular',
  templateUrl: './container-relatorio-seguro-transacoes.component.html',
  styleUrls: ['./container-relatorio-seguro-transacoes.component.css'],
  providers: [
    EnumPipe
  ]
})
export class ContainerRelatorioSeguroTransacoesComponent implements OnInit {

  formRelatorioSeguroTransacoes: FormGroup;
  relatorio: Observable<RelatorioPlurianualModel>;
  listaCooperativas: any;
  resultadoConsulta: Array<any> = [];
  qtdItensPorPagina = 10;
  paginacao: any = {};
  central: any;
  isConsultando = true;
  isDisabledBtnConsulta = false;
  cooperativasTela: any;
  centralTela: any;
  currentPage = 1;
  isCooperativaSelecionada = false;
  isGerarRelatorio = false;
  isUsuario0001 = false;

  dataInicioCalendario: Date = new Date();
  dataMaxInicio: Date = new Date();
  dataMaxFim: Date = new Date();
  dataAtual: Date = new Date();
  dataFimCalendario: Date = new Date();

  isMostrarTabelaRelatorio = false;
  isIniciarCooperativaDisabled = true;
  isValidarCentralCooperativaPeloUsuarioLogado = true;
  cooperativa = false;
  meuEvento = new EventEmitter<string>();
  @ViewChild('instituicaoForm', {static: false}) instituicaoFormInput: ElementRef;
  isCentral = false;

  constructor(
    private formBuilder: FormBuilder,
    private enumPipe: EnumPipe,
    private translate: TranslateService,
    private serviceSGT: RelatorioSeguroTransacoesService,
    private customAlertService: CustomAlertService,
    private authStore: Store<fromAuth.State>,
    private authStore$: Store<fromAuth.State>
  ) {
  }

  ngOnInit() {
    this.iniciarFormulario();
  }

  iniciarFormulario() {
    this.formRelatorioSeguroTransacoes = this.formBuilder.group({
      instituicao: [[]],
      pontoAtendimento: ['', [this.validarPa()]],
      dataInicio: [this.dataInicioCalendario, [Validators.required]],
      dataFim: [this.dataFimCalendario, [Validators.required]],
    });
  }

  isUsuario0001Event() {
    this.isUsuario0001 = true;
    this.dataInicioCalendario.setMonth(this.dataInicioCalendario.getMonth() - 6);
  }

  verificarDataFim() {
    if (this.formRelatorioSeguroTransacoes.get('dataInicio').value > this.formRelatorioSeguroTransacoes.get('dataFim').value
      || this.formRelatorioSeguroTransacoes.get('dataFim').value > this.dataAtual) {
      this.formRelatorioSeguroTransacoes.get('dataFim').setValue(null);
      this.isDisabledBtnConsulta = true;
    } else {
      this.isDisabledBtnConsulta = false;
    }
  }

  verificarDataInicio(event) {
    //adicionando 6 meses de limite para o fim de vigencia
    if (this.formRelatorioSeguroTransacoes.get('dataInicio').value && this.isUsuario0001 == true) {
      const dataFinal = new Date(this.formRelatorioSeguroTransacoes.get('dataInicio').value);
      dataFinal.setMonth(dataFinal.getMonth() + 6);

      if (dataFinal < this.dataAtual) {
        this.dataMaxFim = dataFinal;
      }

      if (this.formRelatorioSeguroTransacoes.get('dataFim').value > this.dataMaxFim
        || this.formRelatorioSeguroTransacoes.get('dataInicio').value > this.formRelatorioSeguroTransacoes.get('dataFim').value) {
        this.formRelatorioSeguroTransacoes.get('dataFim').setValue(null);
        this.isDisabledBtnConsulta = true;
      } else {
        this.isDisabledBtnConsulta = false;
      }
    } else {
      if (this.formRelatorioSeguroTransacoes.get('dataInicio').value > this.dataAtual ||
        this.formRelatorioSeguroTransacoes.get('dataInicio').value == null) {
        this.formRelatorioSeguroTransacoes.get('dataInicio').setValue(null);
        this.isDisabledBtnConsulta = true;
      } else {
        this.isDisabledBtnConsulta = false;
      }
    }
  }

  montarParametrosConsulta(pagina?: number) {
    return {
      idCooperativa: this.formRelatorioSeguroTransacoes.get('instituicao').value,
      pa: this.formRelatorioSeguroTransacoes.get('pontoAtendimento').value,
      dataInicio: this.formRelatorioSeguroTransacoes.get('dataInicio').value,
      dataFim: this.formRelatorioSeguroTransacoes.get('dataFim').value,
      pagina: pagina ? pagina : 1,
      tamanhoPagina: this.qtdItensPorPagina,
      central: this.isCentral,
      isGerarRelatorio: false
    };
  }

  async consultarRelatorioVendasSeguroTransacoes(pagina?: number) {
    if (this.formRelatorioSeguroTransacoes.valid) {
      const consulta = this.montarParametrosConsulta(pagina);

      if (this.isGerarRelatorio == false) {
        this.consultaDadosRelatorio(consulta);
      } else {
        if (this.isGerarRelatorio == true) {
          await this.gerarDadosDoCSV();
        }
      }
    } else {
      this.formRelatorioSeguroTransacoes.get('pontoAtendimento').markAsTouched();
    }
  }

  async gerarDadosDoCSV() {
    let resultadoDosDados = [];
    let qtdPaginas = this.paginacao.totalRegistros > 250 ? Math.ceil(this.paginacao.totalRegistros / 250) : 1;

    for (let pagina = 1; pagina <= qtdPaginas; pagina++) {
      const consulta = this.montarParametrosConsulta(pagina);
      consulta.tamanhoPagina = 250;
      await this.serviceSGT.consultaRelatorio(consulta).toPromise().then((res) => {
        let resultados = res.resultado;
        if (this.formRelatorioSeguroTransacoes.get('instituicao').value === 1) {
          for (let rC of resultados) {
            rC.central = '0001';
            rC.cooperativa = '0001';
          }
        }
        resultadoDosDados.push(...resultados)
      });
    }
    this.montarCSV(resultadoDosDados);
  }

  consultaDadosRelatorio(consulta) {
    this.serviceSGT.consultaRelatorio(consulta).subscribe((res) => {
      if (res != undefined || res != null && res.relatorio) {
        this.resultadoConsulta = res.resultado;
        if (res.paginacao) {
          this.paginacao = res.paginacao;
        }
        if (this.formRelatorioSeguroTransacoes.get('instituicao').value === 1) {
          for (let rC of this.resultadoConsulta) {
            rC.central = '0001';
            rC.cooperativa = '0001';
          }
        }
        this.isMostrarTabelaRelatorio = true;
        this.isConsultando = false;
      } else {
        this.resultadoConsulta = [];
      }
    }, error => {
      this.isMostrarTabelaRelatorio = false;
      this.isConsultando = true;
    });
  }

  montarCSV(resultadoConsulta: Array<any>) {
    let csv = '';
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};

    /** header do csv */
    csv += 'Central;Cooperativa;Nome;CPF;Data do Relatorio;Valor;Forma de Pagamento;Canal;Situação;\n';

    resultadoConsulta.forEach((dado) => {
      const dataFormatada = dado.data ? dado.data.substring(0, 10) : '';
      const valorFormatado = dado.valor != undefined ? 'R$ ' + String(dado.valor).replace(/\./g, ',') : '';
      const cpfFormatado = dado.cpf ? dado.cpf.substring(0, 3) + '.' + dado.cpf.substring(3, 6) + '.' + dado.cpf.substring(6, 9) + '-' + dado.cpf.substring(9) : '';
      const formaPagamento = dado.formaPagamento != undefined ? dado.formaPagamento : '';
      const nomeValidado = dado.nome != undefined ? dado.nome : '';
      csv += `"${dado.central}";"${dado.cooperativa}";"${nomeValidado}";"${cpfFormatado}";"${dataFormatada}";"${valorFormatado}";"${formaPagamento}";"${dado.canal}";"${dado.situacao}"`;
      /** pular linha */
      csv += '\n';
    });

    let blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv; charset=utf-8'
    });

    FileSaver.saveAs(blob, 'relatorio_vendas_seguro_transacoes' + '_export_' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.csv');
    this.isGerarRelatorio = false;
  }

  novaConsulta() {
    this.isConsultando = true;
    this.isMostrarTabelaRelatorio = false;
    this.currentPage = 1;
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


  gerarCSV() {
    this.isGerarRelatorio = true;
    this.consultarRelatorioVendasSeguroTransacoes();
  }

  private validarPa(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      if (!!this.formRelatorioSeguroTransacoes) {
        if (control.value < 0) {
          return {'PaNegativo': this.translate.get('Tamanho do PA Inválido')};
        }
        if (control.value > 9999) {
          return {'PaAcimaDoPermitido': this.translate.get('Tamanho do PA Inválido')};
        }
      }
      return null;
    };
  }

  validarCooperativaSelecionada(event: any) {
    if (event == null) {
      this.isCentral = true;
      this.isCooperativaSelecionada = false;
      this.formRelatorioSeguroTransacoes.get('pontoAtendimento').disable();
    } else {
      this.isCentral = false;
      this.isCooperativaSelecionada = true;
      this.formRelatorioSeguroTransacoes.get('pontoAtendimento').enable();
    }
  }

  isCentralTrue(event) {
    this.isCentral = true;
  }

  async pageChanged(formInstituicao: FormGroup, $event: number) {
    this.currentPage = $event;
    await this.consultarRelatorioVendasSeguroTransacoes($event);
  }

}
