import { Pipe, PipeTransform } from '@angular/core';
import { MaskApplierService } from 'ngx-mask';


@Pipe({
  name: 'cpfOuCnpj',
})
export class CpfCnpjPipe implements PipeTransform {

  constructor(private maskService: MaskApplierService) {
  }

  transform(value: any) {
    if (!value) {
      return '';
    }

    if (value.length > 11) {
      return this.maskService.applyMask(value, '00.000.000.0000-00');
    }

    return this.maskService.applyMask(value, '000.000.000-00');
  }
}
