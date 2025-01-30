Importante: Atualize da versão 1.x para 2.0

A migração para a versão 2.0, devido à incorporação da nova v2 componentes, inclui um processo adicional que é executado automaticamente como assim que o aplicativo é iniciado. Se sua instância do Penpot local contém uma quantidade significativa de dados (como centenas de penpot arquivos, especialmente aqueles que utilizam componentes e ativos SVG extensivamente), este processo pode levar alguns minutos.

Em alguns casos, como quando o script encontra um erro, pode ser conveniente para executar o processo manualmente. Para fazer isso, você pode desativar O processo de migração automática usando o sinalizador na variável ambiente. Em seguida, você pode executar o processo de migração manualmente com o seguinte comando:disable-v2-migrationPENPOT_FLAGS

docker exec -ti <container-name-or-id> ./run.sh app.migrations.v2