import {Injectable} from '@angular/core';
import {BaseService} from '@shared/services/base.service';
import {HttpClient} from '@angular/common/http';
import {CustomAlertService} from '@shared/services/alert-custom.service';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MsgErrorEnum} from '@shared/enum/message.enum';
import {InstituicaoModel} from '@app/models/instituicao.model';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class InstituicaoService extends BaseService {
  private API_INSTITUICOES = `${environment.REST_URL}`;
  //private API_INSTITUICOES = `${environment.REST_URL}/sgr/instituicoes`;
  //private API_INSTITUICOES = `http://backofficeseguroscluster-ti:9080/sgr/instituicoes`;

  private SINGULARES = `singulares`;
  private CENTRAIS = `centrais`;
  private SCI = `sistema-cadastro-instituicoes`;
  private INSTITUICOES = `instituicoes`;
  private HIERAQUIAS = `hierarquia-simples`;

  constructor(private http: HttpClient, customAlertService: CustomAlertService) {
    super(customAlertService);
  }

  public buscarSeguradora(id): Observable<{ isSeguradora: boolean }> {
    return this.http.get<any>(`${this.API_INSTITUICOES}/sgr/v1/instituicoes/${id}`, this.httpOptions).pipe(
      map(resposta => {
        if (resposta && resposta.resultado) {
          return {
            isSeguradora: resposta.resultado.isSeguradora
          };
        }
      }),
      catchError((error) => this.handleError(error, MsgErrorEnum.CONSULTA_CENTRAIS))
    );
  }

  buscarCentrais(): Observable<{ centrais: InstituicaoModel[]}> {
    return this.http.get<any>(`${this.API_INSTITUICOES}/${this.SCI}/v1/${this.CENTRAIS}`, this.httpOptions).pipe(
      map((resposta: any) => {
        if (resposta && resposta.resultado) {
          return {
            centrais: resposta.resultado.map(r => {
              return {
                      descricao: `${r.numero} - ${r.nomeInstituicao}`,
                      idInstituicao: r.id,
                      nome: r.nomeInstituicao,
                      numeroCooperativa: r.numero,
                      sigla: r.siglaInstituicao
                    };
            })
          }
        }
      }),
      catchError(error => this.handleError(error))
    );
  }
  buscarCentralPorCooperativa(numeroCooperativa): Observable<any> {
    return this.http.get<any>(`${this.API_INSTITUICOES}/${this.SCI}/v1/${this.INSTITUICOES}/${numeroCooperativa}/instituicao`).pipe(
      map((resposta: any) => {
        if (resposta && resposta.resultado) {
          return resposta;
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  buscarCooperativas(id): Observable<InstituicaoModel[]> {
    return this.http.get<InstituicaoModel[]>(`${this.API_INSTITUICOES}/${this.SCI}/v1/${this.CENTRAIS}/${id}/${this.SINGULARES}`).pipe(
      map((resposta: any) => {
        if (resposta && resposta.resultado) {
          return resposta.resultado.map(r => {
            return {idInstituicao: r.id,
                    descricao: `${r.numeroCooperativa} - ${r.instituicao.nomeInstituicao}`,
                    nome: r.instituicao.nomeInstituicao,
                    numeroCooperativa: r.numeroCooperativa,
                    sigla: r.instituicao.siglaInstituicao
                  };
          });
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  buscarHierarquiaSimples(id): Observable<InstituicaoModel> {
    return this.http.get<InstituicaoModel>(`${this.API_INSTITUICOES}/${this.SCI}/v1/${this.INSTITUICOES}/${id}/${this.HIERAQUIAS}`).pipe(
      map((resposta: any) => {
        return  <InstituicaoModel>{
          idInstituicao: resposta.resultado.id,
            descricao: `${resposta.resultado.id} - ${resposta.resultado.descricao}`,
            nome: resposta.resultado.nome,
            numeroCooperativa: resposta.resultado.numeroCooperativa,
            sigla: resposta.resultado.sigla,
            identificadorPai: resposta.resultado.identificadorPai,
            codigoGrauCooperativa: resposta.resultado.codigoGrauCooperativa
        }
      }),
      catchError(error => this.handleError(error))
    );
  }



}

