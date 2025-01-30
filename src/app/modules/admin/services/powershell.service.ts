import { Injectable } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import {from} from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class PowershellService {
    constructor() {}

    cleanupProcesses(): Promise<string> {
        if (typeof window !== 'undefined' && window.electronAPI) {
            return window.electronAPI.cleanupProcesses();
        } else {
            return Promise.reject('electronAPI não está disponível.');
        }
    }
    runCommand(command: string): Promise<string> {
        if (typeof window !== 'undefined' && window.electronAPI) {
            return window.electronAPI.runPowerShellCommand(command);
        } else {
            return Promise.reject('electronAPI não está disponível.');
        }
    }

    runBackgroundProcess(command: string, params: string): Promise<string> {
        if (typeof window !== 'undefined' && window.electronAPI) {
            return window.electronAPI.runBackgroundProcess(command, params);
        } else {
            return Promise.reject('electronAPI não está disponível.');
        }
    }

    showNotification(notificationTitle:string,notificationBody:string): void{
            window.electronAPI.showNotification(notificationTitle,notificationBody);
    }

    getHomeDirectory(): string {
        if (typeof window !== 'undefined' && window.electronAPI) {
            return window.electronAPI.getHomeDirectory();
        } else {
            throw new Error('electronAPI não está disponível.');
        }
    }

    fileExists(filePath: string): boolean {
        if (typeof window !== 'undefined' && window.electronAPI) {
            return window.electronAPI.fileExists(filePath);
        } else {
            throw new Error('electronAPI não está disponível.');
        }
    }

     getAbsolutePath(relativePath: string): string {
        if (typeof window !== 'undefined' && window.electronAPI) {
            return  window.electronAPI.getAbsolutePath(relativePath);
        } else {
            throw new Error('electronAPI não está disponível.');
        }
    }

    async ensureHyperV(): Promise<boolean> {
        let hyperVEnabled:boolean=null;
        try {
            const hyperVStatus = await this.runCommand('Get-WindowsOptionalFeature -FeatureName Microsoft-Hyper-V-All -Online');
            console.log('Hyper-V Status:', hyperVStatus);

            if (!hyperVStatus.includes('Enabled')) {
                console.log('Hyper-V não está habilitado. Tentando habilitar o Hyper-V...');
                try {
                    await this.runCommand('Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All');
                    console.log('Hyper-V habilitado com sucesso. Um reinício pode ser necessário.');
                    await this.runCommand('Start-Sleep -Seconds 5');
                    hyperVEnabled =  true;
                } catch (error) {
                    console.log('Falha ao habilitar o Hyper-V. Por favor, habilite o Hyper-V manualmente.');
                    hyperVEnabled =  false;
                }
            } else {
                hyperVEnabled =  true;
                console.log('Hyper-V já está habilitado.',hyperVEnabled);
            }
        } catch (error) {
            console.error('Erro ao verificar o status do Hyper-V:', error);
            hyperVEnabled =  false;
        }
        return hyperVEnabled;
    }

    killProcess(processName: string): Promise<string> {
        const command = `Get-Process ${processName} -ErrorAction SilentlyContinue | Stop-Process -Force`;
        return this.runCommand(command);
    }

    updateHostsFilesInServer(serverName: string, hostname: string) {
            return from(window.electronAPI.updateHostsFilesInServer(serverName,hostname));
    }

    updateHostsFilesInContainer(serverName: string, containerHostsDirPath: string, host:string) {
        return from(window.electronAPI.updateHostsFilesInContainer(serverName,containerHostsDirPath, host));
    }
}
