import { Component, Inject, OnInit } from '@angular/core';
import { CapesService } from '@app/shared/services/capes.service';
import { ModalRef, MODAL_DATA } from '@sicoob/ui';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import { TranslateService } from '@ngx-translate/core';

const LIMITE_TOTAL_REGISTRO: number = 50;

@Component({
  selector: 'sc-modal-listar-proponente',
  templateUrl: './modal-listar-proponente.component.html',
  styleUrls: ['./modal-listar-proponente.component.css']
})
export class ModalListarProponenteComponent implements OnInit {

  totalItems = 0; // limitado até 50 registros
  boundaryLinks = false; // Define se deve mostrar primeiro e último
  directionLinks = true; // Define se deve mostrar próximo e anterior
  iconLinks = false; // Define se devem ser utilizados ícones ou texto para boundaryLinks e directionLinks
  minhaPagina = 1; // Esta variável seta o valor e é alterada quando o usuário muda a página
  itemsPerPage = 10;

  dadosPessoas: PessoaModel[];
  filtroConsultaPessoas: any;
  isPJ: boolean;


  constructor(
    public ref: ModalRef,
    @Inject(MODAL_DATA) public data: any,
    private capesService: CapesService,
    private translate: TranslateService) {
      this.dadosPessoas = data?.resultado?.resultado;
      this.filtroConsultaPessoas = data?.filtro;
      this.totalItems = data.resultado.totalRegistros;
      this.itemsPerPage = data.resultado.tamanhoPagina;
      this.minhaPagina = data.resultado.pagina;
    }

  ngOnInit() {
    for (let index = 0; index <  this.dadosPessoas.length; index++) {
     
      let cpfOuCnpj = this.verificarCPFCNPJ(this.dadosPessoas[index].cpfCnpj)
      if(cpfOuCnpj == "CPF"){
        this.isPJ = false;
      }else{
        this.isPJ = true;
      }
                    
    }      
  }

  close() {
    this.ref.close('');
  }

  public getJustificativasCancelamento() {
    // return Object.values(CancelamentoEnum);
  }

  /**
   * Esta função é chamada quando o número
   * da página é alterada
   * @param n
   */
   onPageChanged(n: number) {
    this.consultaPessoas(n > 0 ? n -1 : n);
  }

  /**
   * Esta função é chamada quando a quantidade
   * total de items é alterada
   * @param n
   */
  onTotalPagesChanged(n: number) {
  //  console.log('total', n);
  }

  /**
   * Esta função é chamada quando a página é modificada.
   * Ela recebe os dados desta página específica.
   * @param pageData
   */
  onPaginatedData(pageData: any) {
    // console.log('page', pageData);
  }
   verificarCPFCNPJ(numero) {
    const num = numero.replace(/\D/g, '');
    if (num.length === 11) {
        return 'CPF';
    } else if (num.length === 14) {
        return 'CNPJ';
    } else {
        return 'Inválido';
    }
}

  public consultaPessoas(pagina: Number) {
    this.capesService.consultarNomeOuApelido(this.filtroConsultaPessoas, pagina, 10).subscribe(pessoaResp => {
      this.dadosPessoas = pessoaResp?.resultado;

      this.totalItems = pessoaResp?.totalRegistros <= LIMITE_TOTAL_REGISTRO ? pessoaResp?.totalRegistros : LIMITE_TOTAL_REGISTRO; // Limitado até 50 registros
      this.itemsPerPage = pessoaResp?.tamanhoPagina;
      this.minhaPagina = pessoaResp?.pagina;
    });
  }

  public pessoaSelecionada(pessoa: PessoaModel) {
    this.ref.close({pessoaSelecionada: pessoa});
  }

}
