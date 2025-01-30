import {DadosArquivo} from '@shared/services/base64.service';

export interface Arquivo {
  id?: number;
  tipo: string;
  dadosArquivo: DadosArquivo;
}


