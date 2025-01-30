import {Component, OnInit} from '@angular/core';
import {EnumPipe} from '@shared/pipes/enums.pipe';
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '@sicoob/security';
import {RelatorioPlurianualModel} from '@funcionalidades/relatorio-auto/models/relatorio-plurianual.model';
import {Observable} from 'rxjs';
import * as FileSaver from 'file-saver';
import {TranslateService} from '@ngx-translate/core';
import {RelatorioSeguroCelularService} from '@funcionalidades/relatorio-seguro-celular/relatorio-seguro-celular.service';
import {CustomAlertService} from '@shared/services/alert-custom.service';

@Component({
  selector: 'sc-container-relatorio-seguro-celular',
  templateUrl: './container-relatorio-seguro-celular.component.html',
  styleUrls: ['./container-relatorio-seguro-celular.component.css'],
  providers: [
    EnumPipe
  ]
})
export class ContainerRelatorioSeguroCelularComponent implements OnInit {

  formRelatorioSeguroCelular: FormGroup;
  relatorio: Observable<RelatorioPlurianualModel>;
  listaCooperativas: any;
  resultadoConsulta: Array<any> = [];
  qtdItensPorPagina = 10;
  paginacao: any = {};
  central: any;
  isConsultando = true;
  isPontoAtendimento = true;
  isCooperativaSelecionada = false;

  dataInicioCalendario: Date = new Date();
  dataFimCalendario: Date = new Date();

  isMostrarTabelaRelatorio = false;
  isIniciarCooperativaDisabled = true;
  isValidarCentralCooperativaPeloUsuarioLogado = true;
  cooperativa = false;
  dataInicio: Date = new Date();
  isCentral = false;

  cooperativasTela: any;
  centralTela: any;
  isDisabledBtnConsulta = false;
  isGerarRelatorio = false;
  isUsuario0001 = false;

  dataMaxInicio: Date = new Date();
  dataMaxFim: Date = new Date();

  dataAtual: Date = new Date();

  currentPage = 1;

  constructor(
    private formBuilder: FormBuilder,
    private enumPipe: EnumPipe,
    private translate: TranslateService,
    private service: RelatorioSeguroCelularService,
    private customAlertService: CustomAlertService,
    private authStore$: Store<fromAuth.State>
  ) {
  }

  ngOnInit() {
    this.iniciarFormulario();
  }

  iniciarFormulario() {
    this.formRelatorioSeguroCelular = this.formBuilder.group({
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
    if (this.formRelatorioSeguroCelular.get('dataInicio').value > this.formRelatorioSeguroCelular.get('dataFim').value
     || this.formRelatorioSeguroCelular.get('dataFim').value > this.dataAtual) {
      this.formRelatorioSeguroCelular.get('dataFim').setValue(null);
      this.isDisabledBtnConsulta = true;
    } else {
      this.isDisabledBtnConsulta = false;
    }
  }

  verificarDataInicio(event) {
    //adicionando 6 meses de limite para o fim de vigencia
    if (this.formRelatorioSeguroCelular.get('dataInicio').value && this.isUsuario0001 == true) {
      const dataFinal = new Date(this.formRelatorioSeguroCelular.get('dataInicio').value);
      dataFinal.setMonth(dataFinal.getMonth() + 6);
      if (dataFinal < this.dataAtual) {
        this.dataMaxFim = dataFinal;
      }
      if (this.formRelatorioSeguroCelular.get('dataFim').value > this.dataMaxFim
        || this.formRelatorioSeguroCelular.get('dataInicio').value > this.formRelatorioSeguroCelular.get('dataFim').value){
        this.formRelatorioSeguroCelular.get('dataFim').setValue(null);
        this.isDisabledBtnConsulta = true;
      }else {
        this.isDisabledBtnConsulta = false;
      }
    }else {
      if (this.formRelatorioSeguroCelular.get('dataInicio').value > this.dataAtual ||
        this.formRelatorioSeguroCelular.get('dataInicio').value == null){
        this.formRelatorioSeguroCelular.get('dataInicio').setValue(null);
        this.isDisabledBtnConsulta = true;
      }else {
        this.isDisabledBtnConsulta = false;
      }
    }
  }

  montarParametrosConsulta(pagina?: number) {
    return {
      idCooperativa: this.formRelatorioSeguroCelular.get('instituicao').value,
      pa: this.formRelatorioSeguroCelular.get('pontoAtendimento').value,
      dataInicio: this.formRelatorioSeguroCelular.get('dataInicio').value,
      dataFim: this.formRelatorioSeguroCelular.get('dataFim').value,
      pagina: pagina ? pagina : 1,
      tamanhoPagina: this.qtdItensPorPagina,
      central: this.isCentral,
      isGerarRelatorio: false
    };
  }

  async consultarRelatorioVendasSeguroCelular(pagina?: number) {
    if (this.formRelatorioSeguroCelular.valid) {
      const consulta = this.montarParametrosConsulta(pagina);

      if (this.isGerarRelatorio == false) {
        this.consultaDadosRelatorio(consulta);
      } else {
        if (this.isGerarRelatorio == true) {
          await this.gerarDadosDoCSV();
        }
      }
    } else {
      this.formRelatorioSeguroCelular.get('pontoAtendimento').markAsTouched();
    }
  }

  async gerarDadosDoCSV() {
    let resultadoDosDados = [];
    let qtdPaginas = this.paginacao.totalRegistros > 250 ? Math.ceil(this.paginacao.totalRegistros / 250) : 1;

    for (let pagina = 1; pagina <= qtdPaginas; pagina++) {
      const consulta = this.montarParametrosConsulta(pagina);
      consulta.tamanhoPagina = 250;
      await this.service.consultaRelatorio(consulta).toPromise().then((res) => {
        let resultados = res.resultado;
        if (this.formRelatorioSeguroCelular.get('instituicao').value === 1) {
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
    this.service.consultaRelatorio(consulta).subscribe((res) => {
      if (res != undefined || res != null && res.relatorio) {
        this.resultadoConsulta = res.resultado;
        if (res.paginacao) {
          this.paginacao = res.paginacao;
        }
        if (this.formRelatorioSeguroCelular.get('instituicao').value === 1) {
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

  gerarCSV() {
    this.isGerarRelatorio = true;
    this.consultarRelatorioVendasSeguroCelular();
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

  montarCSV(resultadoConsulta : Array<any>) {
    let csv = '';
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};

    /** header do csv */
    csv += 'Central;Cooperativa;Nome;CPF;Data do Relatorio;Valor;Forma de Pagamento;Canal;Situação;\n';

    resultadoConsulta.forEach((dado) => {
      const dataFormatada = dado.data ? dado.data.substring(0, 10) : '';
      const valorFormatado = dado.valor != undefined ? 'R$ ' + String(dado.valor).replace(/\./g, ',') : '';
      const formaPagamento = dado.formaPagamento != undefined ? dado.formaPagamento : "";
      const cpfFormatado = dado.cpf ? dado.cpf.substring(0, 3) + '.' + dado.cpf.substring(3, 6) + '.' + dado.cpf.substring(6, 9) + '-' + dado.cpf.substring(9) : '';
      const nomeValidado = dado.nome != undefined ? dado.nome : '';
      csv += `"${dado.central}";"${dado.cooperativa}";"${nomeValidado}";"${cpfFormatado}";"${dataFormatada}";"${valorFormatado}";"${formaPagamento}";"${dado.canal}";"${dado.situacao}"`;
      /** pular linha */
      csv += '\n';
    });

    let blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv; charset=utf-8'
    });

    FileSaver.saveAs(blob, 'relatorio_vendas_seguro_celular' + '_export_' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.csv');

  }

  private validarPa(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      if (!!this.formRelatorioSeguroCelular) {
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
      this.formRelatorioSeguroCelular.get("pontoAtendimento").disable();
    } else {
      this.isCentral = false;
      this.isCooperativaSelecionada = true;
      this.formRelatorioSeguroCelular.get("pontoAtendimento").enable();
    }
  }

  isCentralTrue(event) {
    this.isCentral = true;
  }

  pageChanged(formInstituicao: FormGroup, $event: number) {
    this.currentPage = $event;
    this.consultarRelatorioVendasSeguroCelular($event);
  }
}
