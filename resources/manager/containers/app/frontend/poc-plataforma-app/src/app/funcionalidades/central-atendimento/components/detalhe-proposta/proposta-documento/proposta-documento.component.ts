import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadDocumentosAction, CleanDocumentosAction } from '@app/funcionalidades/central-atendimento/actions/central-atendimento.actions';
import { CentralAtendimentoService } from '@app/funcionalidades/central-atendimento/central-atendimento.service';
import { ListaTiposDocumento } from '@app/funcionalidades/central-atendimento/enums/tipoDocumento.enum';
import { Documento } from '@app/funcionalidades/central-atendimento/models/documento.model';
import { Arquivo } from '@app/funcionalidades/faturamento/models/arquivo.model';
import { Base64Service, DadosArquivo } from '@app/shared/services/base64.service';
import { select, Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Observable, Subscription } from 'rxjs';
import * as fromCentralAtendimento from '../../../reducers/central-atendimento.reducer';

@Component({
  selector: 'sc-proposta-documento',
  templateUrl: './proposta-documento.component.html',
  styleUrls: ['./proposta-documento.component.scss']
})
export class PropostaDocumentoComponent implements OnInit, AfterViewInit, OnDestroy {

  tiposDocumento = ListaTiposDocumento;
  @Input() idProposta: string;

  subcripttion$: Subscription = new Subscription();
  arquivo: Arquivo;
  dadosArquivo: DadosArquivo;
  documentos: Documento[];
  documentosFilter: Documento[];
  formDocumento: FormGroup;

  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-datapick',
    maxDate: new Date(),
    showWeekNumbers: false
  };


  constructor(private storeCentralAtendimento$: Store<fromCentralAtendimento.State>,
    private base64Service: Base64Service, private centralAtendimentoService: CentralAtendimentoService,
    private datePipe: DatePipe, private fb: FormBuilder,) { }

  ngOnInit() {
    this.formDocumento = this.fb.group({
      nomeDocumento: [''],
      dataDocumento: [''],
      tipoDocumento: ['']
    });
    this.filtrarDocumentos();
  }

  ngAfterViewInit(){
    this.storeCentralAtendimento$.pipe(select(fromCentralAtendimento.getDocumentos)).subscribe(doc => {
      this.documentos = doc;
      this.documentosFilter = doc;
    });
    this.storeCentralAtendimento$.dispatch(new LoadDocumentosAction({idProposta: this.idProposta}));
  }

  filtrarDocumentos() {
    this.formDocumento.valueChanges.subscribe(form =>{
      var nome = this.formDocumento.get('nomeDocumento').value;
      var data = this.datePipe.transform(this.formDocumento.get('dataDocumento').value, 'dd/MM/yyyy');
      var tipo = this.formDocumento.get('tipoDocumento').value;
      var doc = this.documentos;
      this.documentosFilter = this.documentos;

      if (nome != '') {
        doc = doc.filter(s => s.id == nome);
      }
      if (tipo != '') {
        doc = doc.filter(s => s.tipoDocumento == tipo);
      }
      if (data != null) {
        doc = doc.filter(s => {
          const dataTipo = this.datePipe.transform(s.dataDocumento, 'dd/MM/yyyy HH:mm:ss');
          return data == dataTipo;
        })
      }
      this.documentosFilter = doc;
    })
  }

  obterDadosArquivo(documento: Documento) {
    this.centralAtendimentoService.obterArquivoProposta(documento.id).subscribe(doc =>{
      this.dadosArquivo = {base64: doc.pagina[0].dados, extensaoArquivo: documento.formato,
        nomeArquivo: doc.tipoDocumento+'_'+this.datePipe.transform(documento.dataDocumento, 'dd_MM_yyyy')};

      this.arquivo = {dadosArquivo: this.dadosArquivo, tipo: documento.formato, id: 0};
      this.downloadArquivo()
    })
  }

  downloadArquivo() {
    this.base64Service.downloadArquivo(this.arquivo.dadosArquivo);
  }

  ngOnDestroy() {
    this.storeCentralAtendimento$.dispatch(new CleanDocumentosAction());
  }

}
