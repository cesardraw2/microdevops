import { PessoaModel } from "@app/shared/components/capes/models/response/pessoa.model";

export interface RespostaPessoaModel {
    ordemCrescente: boolean;
    pagina: number;
    resultado: PessoaModel[];
    tamanhoPagina: number;
    totalRegistros: number;
}
