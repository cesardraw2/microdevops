import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

/**
* valida e adiciona os campos dos filtros como parametros
* de pesquisa
*
* @param filters filtros de pesquisa
* @returns HttpParams com os parametros inseridos
*/
export function converterFiltroParamentros(filters: Object): HttpParams {
  let params = new HttpParams();
  if (filters) {
    Object.keys(filters).forEach(key => {
      let paramValue = filters[key];
      if (paramValue && !(paramValue instanceof Array && paramValue.length == 0)) {
        if (paramValue instanceof Date) {
          paramValue = new DatePipe('pt').transform(paramValue.getTime(), 'yyyy-MM-dd');
        }
        params = params.append(key, paramValue);
      }
    });
  }
  return params;
}
