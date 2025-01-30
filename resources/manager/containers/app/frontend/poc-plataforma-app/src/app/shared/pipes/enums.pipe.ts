import {TranslatePipe} from '@ngx-translate/core';
import {Pipe} from '@angular/core';

@Pipe({
  name: 'enum'
})
export class EnumPipe extends TranslatePipe {

  transform(query: string, ...args: any[]) {
    if (query === '' || query === null || query === undefined) {
      return '-';
    }
    return super.transform(`ENUMS.${args[0]}.${query}`);
  }

}
