const {  ipcRenderer } = require('electron/renderer');
const { contextBridge } = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {

    updateHostsFilesInServer: (serverName, hostname) => {
        console.log(`updateHostsFilesInServer called with params:: ${serverName}, ${hostname}`);
        return ipcRenderer.invoke('update-hosts-files-in-server', serverName,  hostname);
    },
    updateHostsFilesInContainer: (serverName, containerHostsDirPath, host) => {
        console.log(`updateHostsFilesInContainer called with params:: ${serverName}, ${containerHostsDirPath}, ${host}`);
        return ipcRenderer.invoke('update-hosts-files-in-container', serverName, containerHostsDirPath, host);
    },
    runPowerShellCommand: (command) => {
        console.log('runPowerShellCommand called with command:', command);
        return ipcRenderer.invoke('run-powershell-command', command);
    },
    showNotification: (notificationTitle,notificationBody) => {
        return ipcRenderer.invoke('show-notification',notificationTitle,notificationBody);
    },
    runBackgroundProcess: (command,params) => {
        console.log('runBackgroundProcess called with command:', command);
        return ipcRenderer.invoke('run-background-process', command, params);
    },
    cleanupProcesses: () => {
        console.log('cleanupProcesses called.');
        return ipcRenderer.invoke('cleanupProcesses');
    },
    getHomeDirectory: () => {
        console.log('getHomeDirectory called');
        return os.homedir();
    },
    getResourcesPath: () => path.join(__dirname, 'resources'),
    fileExists: (filePath) => fs.existsSync(filePath),
    getAbsolutePath: (relativePath) => path.resolve(relativePath)
});
