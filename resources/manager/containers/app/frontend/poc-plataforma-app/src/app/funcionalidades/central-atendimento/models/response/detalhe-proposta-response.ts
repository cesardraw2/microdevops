export interface DetalhePropostaResponse {
  'resultado':
    [
      {
        'data': Date,
        'id': string,
        'modelo': string,
        'nomeProponente': string,
        'status': {
          'status': string,
          'dataUltimaAlteracao': Date,
          'observacoes': string,
          'pendencias': string
        },
        'tipo': string,
        'valorCoberturaPrincipal': string,
        'valorTotal': string
        'produtos': [
          {
            'nome': string,
            'id': string,
            'coberturas':[
              {
                'id': string,
                'nome': string,
                'tipo': string,
                'itemProdutoId': string,
                'premio': string,
                'capitalSegurado': string,
                'obrigatorio': string,
                'prazoCerto': string
              }
            ]
          }
        ]
      }
    ];
}

/* [
  {
      "data": "2020-07-20T00:00:00",
      "id": "500483284",
      "modelo": "SG",
      "nomeProponente": "TESTE IMPLANTACAO TI I",
      "status": {
          "status": "Em Análise",
          "dataUltimaAlteracao": "2020-09-14T18:43:24.793",
          "observacoes": "",
          "pendencias": ""
      },
      "tipo": "VidaEmGrupo",
      "valorCoberturaPrincipal": "10000",
      "valorTotal": "83.831",
      "produtos": [
          {
              "nome": "",
              "id": "70070573",
              "coberturas": [
                  {
                      "id": "0",
                      "nome": "",
                      "tipo": "RiscoGrupo",
                      "itemProdutoId": "203121",
                      "premio": "6.51",
                      "capitalSegurado": "10000",
                      "obrigatorio": "false",
                      "prazoCerto": ""
                  },
                  {
                      "id": "0",
                      "nome": "",
                      "tipo": "RiscoGrupo",
                      "itemProdutoId": "203130",
                      "premio": "0.651",
                      "capitalSegurado": "1000",
                      "obrigatorio": "true",
                      "prazoCerto": ""
                  },
                  {
                      "id": "0",
                      "nome": "",
                      "tipo": "Emprestimo",
                      "itemProdutoId": "203150",
                      "premio": "0.46",
                      "capitalSegurado": "3500",
                      "obrigatorio": "false",
                      "prazoCerto": ""
                  }
              ]
          }
      ]
  }
]
 */
