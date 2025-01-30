## Comandos de desenvolvimento usando o android
 ng build --prod --base-href ./
 cordova build android
 cordova run android

## Adicionando plugins a partir de um diretório
 cordova plugin add ../GertecEPOS700

### Atualizando o plugin a partir de um diretório
cordova plugin rm gertec-epos-700 --save && cordova plugin add ../GertecEPOS700
