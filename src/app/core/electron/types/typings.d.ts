interface ElectronAPI {
    runPowerShellCommand: (command: string) => Promise<string>;
    updateHostsFilesInServer: (serverName: string, hostname: string) => Promise<any>;
    updateHostsFilesInContainer: (serverName: string, containerHostsDirPath: string, host:string) => Promise<any>;
    runBackgroundProcess: (command: string, params:string) => Promise<string>;
    showNotification: (notificationTitle: string, notificationBody:string) => void;
    cleanupProcesses: () => Promise<string>;
    getHomeDirectory: () => string;
    getResourcesPath: () => string;
    ensureHyperV: ()=>Promise<boolean>;
    fileExists: (command: string)=>boolean;
    getAbsolutePath: (command: string) => string;
}

interface Window {
    electronAPI: ElectronAPI;
}

// Adicione isso para garantir que o TypeScript reconheça
declare var window: Window & typeof globalThis;
