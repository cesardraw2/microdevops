import {Injectable} from '@angular/core';
import {BaseService} from '@shared/services/base.service';
import {HttpClient} from '@angular/common/http';
import {CustomAlertService} from '@shared/services/alert-custom.service';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MsgErrorEnum} from '@shared/enum/message.enum';
import {environment} from '@env/environment';
import { PessoaModel } from '@app/shared/components/capes/models/response/pessoa.model';
import { Color } from '@sicoob/ui';
import { RespostaPessoaModel } from '../components/capes-filtro/models/response/response.pessoa.model';

@Injectable({
  providedIn: 'root'
})
export class CapesService extends BaseService {
  private API_CAPES = `${environment.REST_URL}/capes-consulta/v1`;

  private PESSOAS_CPFCNPJ = `/pessoas/cpfcnpj`;
  private INSTITUICOES = `/instituicao`;
  private PESSOAS_INSTITUICAO = `/pessoas/instituicao`;

  constructor(private http: HttpClient, customAlertService: CustomAlertService) {
    super(customAlertService);
  }

  public consultarCpfCnpj(dadosPessoa: PessoaModel): Observable<PessoaModel> {
    return this.http.get<{resultado: PessoaModel}>
      (`${this.API_CAPES}${this.PESSOAS_CPFCNPJ}/${dadosPessoa.cpfCnpj}${this.INSTITUICOES}/${dadosPessoa.idInstituicao}`,
    this.httpOptions).pipe(map(resultado => {
      if (resultado.resultado) {
        return resultado.resultado;
      } else {
        this.customAlertService.abrirAlert(Color.WARNING, MsgErrorEnum.MSG003_CAPES_CONSULTA_PESSOA_NAO_CONTRADA);
      }
    }),
      catchError((error) => this.handleError(error))
    );
  }

  public consultarNomeOuApelido(dadosPessoa: PessoaModel, pagina: Number, tamanhoPagina: Number): Observable<RespostaPessoaModel> {
    return this.http.get<{resultado: RespostaPessoaModel}>
      (`${this.API_CAPES}${this.PESSOAS_INSTITUICAO}/${dadosPessoa.idInstituicao}`
      +`?nomePessoa=${dadosPessoa.nomePessoa}&nomeApelido=${dadosPessoa.nomeApelido}`
      +`&pagina=${pagina}&tamanhoPagina=${tamanhoPagina}`,
    this.httpOptions).pipe(map(resultado => {
      if (resultado?.resultado?.totalRegistros > 0) {
        return resultado.resultado;
      } else {
        this.customAlertService.abrirAlert(Color.WARNING, MsgErrorEnum.MSG003_CAPES_CONSULTA_PESSOA_NAO_CONTRADA);
      }
    }),
      catchError((error) => this.handleError(error))
    );
  }
 
}
