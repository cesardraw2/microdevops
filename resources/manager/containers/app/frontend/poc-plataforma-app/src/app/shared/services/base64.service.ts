import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Base64Service {

  constructor() {
  }

  getArquivo(files): Observable<DadosArquivo> {
    return new Observable((subscriber) => {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = () => {
          const bate64String = reader.result.toString().replace(/^data:(.*,)?/, '');
          subscriber.next({
            nomeArquivo: files[i].name,
            base64: bate64String,
            extensaoArquivo: this.convertMIMETypeInExtension(files[i].type),
            tamanho: files[i].size,
          });
        };
        reader.onerror = error => subscriber.error(error);
      }
    });
  }

  abrirNovaAba(dadosArquivo: DadosArquivo, wind) {
    if (dadosArquivo.extensaoArquivo === 'image/jpeg'
      || dadosArquivo.extensaoArquivo === 'image/png') {
      this.viewArquivo(dadosArquivo);
    } else if (dadosArquivo.extensaoArquivo === 'application/pdf') {
      this.viewPDF(dadosArquivo, wind);
    } else {
      this.downloadArquivo(dadosArquivo);
    }
  }

  downloadArquivo(dadosArquivo: DadosArquivo): void {
    const base64 = this.formatBase64(dadosArquivo.base64, dadosArquivo.extensaoArquivo);
    const downloadLink = document.createElement('a');
    downloadLink.href = base64;
    downloadLink.download = dadosArquivo.nomeArquivo;
    downloadLink.click();
  }

  private viewArquivo(dadosArquivo: DadosArquivo): void {
    const wind = window.open();
    const image = new Image();
    image.src = this.formatBase64(dadosArquivo.base64, dadosArquivo.extensaoArquivo);
    wind.document.write(image.outerHTML);
  }

  private viewPDF(dadosArquivo: DadosArquivo, wind): void {
    const base64 = this.formatBase64(dadosArquivo.base64, dadosArquivo.extensaoArquivo);
    wind.document.write('<iframe width=\'100%\' height=\'100%\' src=\'' + base64 + '\'></iframe>');
  }

  private formatBase64(base64: string, extensaoArquivo: string) {
    console.log('extenão do arquivo para download : ' + extensaoArquivo.toLowerCase());

    return `data:${this.convertExtensionInMIMEType(extensaoArquivo)};base64,${base64}`;
  }


  private convertMIMETypeInExtension(type: string) {
    switch (type.toLowerCase()) {
      case 'image/jpeg':
      case 'application/pdf':
      case 'image/png':
        return type.toString().replace(/(.*\/)/, '');
      case 'application/vnd.ms-excel':
        return 'xls';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'xlsx';
      case 'application/msword':
        return 'doc';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'docx';
      case 'text/plain':
        return 'txt';
    }
  }

  private convertExtensionInMIMEType(type: string) {
    switch (type.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
      case 'png':
        return 'image/jpeg';
      case 'pdf':
        return 'application/pdf';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'txt':
        return 'text/plain';
    }
  }
}

export interface DadosArquivo {
  nomeArquivo: string;
  base64: string;
  extensaoArquivo: string;
  tamanho?: string;
}
