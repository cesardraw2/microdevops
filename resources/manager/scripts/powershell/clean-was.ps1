
$baseDir = "C:\Program Files\IBM\WebSphere"


$extensions = @("*.dmp", "*.phd", "*.txt", "*.trc", "*.log")

$foldersToClean = @("logs", "wstemp", "temp","AppServer")


function startClean {
 param (
        [string]$directory
    )

    # Apagar arquivos com extensões específicas
    foreach ($extension in $extensions) {
        Get-ChildItem -Path $directory -Include $extension -File -Recurse | ForEach-Object {
            try {
                Remove-Item -Path $_.FullName -Force -ErrorAction Stop
                Write-Output "Apagado: $($_.FullName)"
            } catch {
                Write-Output "Erro ao apagar: $($_.FullName) - $_"
            }
        }
    }
    
    # Limpar pastas específicas
    foreach ($folder in $foldersToClean) {
        $folderPath = Join-Path -Path $directory -ChildPath $folder
        if (Test-Path -Path $folderPath) {
            Get-ChildItem -Path $folderPath -Recurse | ForEach-Object {
                try {
                    if (-not $_.PSIsContainer -and ($extensions -contains "*$($_.Extension)")) {
                        Remove-Item -Path $_.FullName -Force -ErrorAction Stop
                        Write-Output "Apagado: $($_.FullName)"
                    } elseif ($_.PSIsContainer) {
                        Get-ChildItem -Path $_.FullName -Recurse | ForEach-Object {
                            if (-not $_.PSIsContainer -and ($fileExtensions -contains "*$($_.Extension)")) {
                                Remove-Item -Path $_.FullName -Force -ErrorAction Stop
                                Write-Output "Apagado: $($_.FullName)"
                            }
                        }
                    }
                } catch {
                    Write-Output "Erro ao apagar: $($_.FullName) - $_"
                }
            }
        }
    }
}


startClean -directory $baseDir

Write-Output "Limpeza dos arquivos e pastas do WAS concluída com sucesso."
