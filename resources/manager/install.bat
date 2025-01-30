@echo off
setlocal

:: Definição de variáveis de ambiente
set "ENVIRONMENT_PATH=."
set "CONTAINERS_PATH=%ENVIRONMENT_PATH%/conteiners"
set "SSO_PATH=%CONTAINERS_PATH%\sso\keycloak"
set "REGEX_PATH=%CONTAINERS_PATH%\python\regex101"
set "MAINFRAME_PATH=%CONTAINERS_PATH%\mainframe"
set "DB_PATH=%CONTAINERS_PATH%\db"
set "ADMINER_PATH=%DB_PATH%\adminer"
set "PROXY_PATH=%CONTAINERS_PATH%\proxy"
set "ANGULAR_PATH=%CONTAINERS_PATH%\angular"

set "VM_HOST=dev-server.local"
set "VM_HOST_API_TEST=http://%VM_HOST%:5000"

:: Obtendo data e hora atual
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set dt=%%I
set "dt=%dt:~0,4%%dt:~4,2%%dt:~6,2%%dt:~8,2%%dt:~10,2%%dt:~12,2%"
set "LOG_FILE=%dt%.log"

:: Função de inicialização
call :init

goto :EOF

:init
	echo Inicializando o Instalador...
	:: chame aqui o comando para iniciar a instalação, por exemplo:
	:: call startInstall
	goto :EOF



: startInstall
echo Inicializando o Instalador... >> "%LOG_FILE%"
call :showStartTime
call :createVM
call :updateLinux
call :validateInstalation
call :showEndTime
echo FIM >> "%LOG_FILE%"
goto :EOF



endlocal
