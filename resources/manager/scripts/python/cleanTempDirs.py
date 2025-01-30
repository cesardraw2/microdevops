import os
import shutil

# Diretórios a serem limpos
tempDirs = [
    "C:\Program Files\IBM\WebSphere\AppServer\profiles\AppSrv01\wstemp",
    "C:\Program Files\IBMWebSphere\AppServer\profiles\AppSrv01\temp",
    "C:\Program Files\IBM\WebSphere\AppServer\profiles\AppSrv01\logs"
]

for tempDir in tempDirs:
    if os.path.exists(tempDir):
        print("Limpando diretório: " + tempDir)
        shutil.rmtree(tempDir)
        os.makedirs(tempDir)
        print("Diretório limpo e recriado: " + tempDir)
    else:
        print("Diretório não encontrado: " + tempDir)
