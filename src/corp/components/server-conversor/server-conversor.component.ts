import { Component } from '@angular/core';
import * as AdmZip from 'adm-zip';
import * as xml2js from 'xml2js';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-server-conversor',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './server-conversor.component.html',
  styleUrl: './server-conversor.component.scss'
})
export class AppComponent {
  convertedContent = '';

  onFileChange(event: any) {
    const files = event.target.files;
    this.processFiles(files);
  }

  async processFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.endsWith('.war') || file.name.endsWith('.ear')) {
        await this.processArchive(file);
      } else if (file.name.endsWith('.xml')) {
        await this.processXml(file);
      }
    }
  }

  async processArchive(file: File) {
    const zip = new AdmZip(await file.arrayBuffer());
    const zipEntries = zip.getEntries();
    for (const zipEntry of zipEntries) {
      if (zipEntry.entryName.endsWith('.xml')) {
        const xmlContent = zipEntry.getData().toString('utf8');
        await this.convertXmlContent(xmlContent);
      }
    }
  }

  async processXml(file: File) {
    const xmlContent = await file.text();
    await this.convertXmlContent(xmlContent);
  }

  async convertXmlContent(xmlContent: string) {
    const parser = new xml2js.Parser();
    const builder = new xml2js.Builder();
    const result = await parser.parseStringPromise(xmlContent);

    // Realize a conversão das configurações aqui
    // Exemplo: Convertendo uma configuração JNDI
    if (result['web-app'] && result['web-app']['resource-ref']) {
      const resourceRefs = result['web-app']['resource-ref'];
      for (const ref of resourceRefs) {
        // Converta a configuração para o formato OpenLiberty
        // Este é um exemplo simplificado, ajuste conforme necessário
        this.convertedContent += `<jndiEntry jndiName="${ref['res-ref-name']}" value="..."/>\n`;
      }
    }

    const convertedXml = builder.buildObject(result);
    this.convertedContent += convertedXml;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    // Processa a conversão aqui se necessário
  }
}
