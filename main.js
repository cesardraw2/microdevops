const log = require('electron-log');
const { spawn,exec, fork } = require('child_process');
const path = require('path');
const remoteMain = require('@electron/remote/main');
const { app, BrowserWindow, screen,ipcMain, Notification } = require('electron');
const kill = require('tree-kill');
const { promisify } = require('util');
const execAsync = promisify(exec);


let mainWindow;
let childProcesses = [];
let childBackgroundProcesses = [];
let childAsyncProcesses = [];

log.transports.file.level = 'info';
log.transports.console.level = 'info';

log.transports.file.file = path.join(app.getPath('userData'), 'logs/main.log');


remoteMain.initialize();


async function getIpFromHostname(hostname) {
    try {
        console.log(`Getting ip from ${hostname}`);
        const { stdout } = await execAsync(`nslookup ${hostname}`);
        const regex = /((25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.){3}(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})/;

        const match = stdout.match(regex);
        console.log('MATCH:::: ', JSON.stringify(match));

        if (match) {
            return match[0];
        } else {
            console.log('MATCH:::: ', match);
            throw new Error(`Unable to resolve IP for hostname: ${hostname}`);
        }
    } catch (error) {
        console.error('Error getting IP from hostname:', error);

        throw error;
    }
}

async function updateHostsFilesInServer(serverName, hostname) {
    try {
        const ip = await getIpFromHostname(hostname);
        console.log(`IP for ${hostname} is ${ip}`);
        const response = await execAsync(`multipass exec ${serverName} -- sudo sh -c "sudo sed -i '/${hostname}/d' /etc/hosts && echo '${ip} ${hostname}' | sudo tee -a  /etc/hosts"`);
        //setCleanEvents(child,childAsyncProcesses);

        console.log(`Added ${ip} ${hostname} to ${serverName} hosts file. RESPONSE: `, response);
    } catch (error) {
        console.error('Error updating hosts files:', error);
        throw error;
    }
}

async function updateHostsFilesInContainer(serverName, containerHostsDirPath, host) {
    try {
        const ip = await getIpFromHostname(host);
        console.log(`IP for ${host} is ${ip}`);

        const command = `multipass exec ${serverName} -- bash -c "touch ${containerHostsDirPath} && sed -i '/${host}/d' ${containerHostsDirPath} && echo '${ip} ${host}' | tee -a ${containerHostsDirPath}"`;
        console.log(`COMMAND::: `, command);
        const response = await execAsync(command);

        console.log(`Added ${ip} ${host} to ${containerHostsDirPath} hosts file. RESPONSE: `, response);
    } catch (error) {
        console.error('Error updating hosts files in VM: ', error);
        throw error;
    }
}



function setCleanEvents(child,listProcess) {
    childProcesses.push(child);
    if ('on' in child && typeof child.on === 'function') {
        child.on('exit', () => {
            listProcess = listProcess.filter(cp => cp !== child);

        });
        child.on('close', (code) => {
            listProcess = listProcess.filter(cp => cp !== child);
        });
    }
}


function showNotification (notificationTitle,notificationBody) {
    new Notification({ title: notificationTitle, body: notificationBody }).show();
}

function createWindow() {
    console.log('Creating main window');
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: false,
            webviewTag: true,
        }
    });

    remoteMain.enable(mainWindow.webContents);

    mainWindow.loadFile('dist/micro-devops-app/index.html');

    mainWindow.webContents.openDevTools();

    mainWindow.webContents.on('did-fail-load', () => {
        log.error('Window failed to load');
    });

    mainWindow.webContents.on('did-finish-load', () => {
        log.info('Window finished loading');
    });

    mainWindow.webContents.on('crashed', () => {
        log.error('Window crashed');
    });

    mainWindow.on('closed', () => {
        log.info('Window closed');
        mainWindow = null;
    });

    mainWindow.on('close', () => {
        log.info('Window closing...');
        cleanupProcesses();
    });
}

// Inicia o servidor de métricas
const metricsServer = fork(path.join(__dirname, 'metrics-server.js'));

app.whenReady().then(() => {
    createWindow();

    // Inicie o servidor de métricas
/*
    const metricsServer = spawn('node', ['metrics-server.js'], {
        stdio: 'inherit'
    });
*/

metricsServer.on('close', (code) => {
        console.log(`Servidor de métricas encerrado com código ${code}`);
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    metricsServer.kill();
    if (process.platform !== 'darwin') {
        cleanupProcesses();
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        log.info('App activated, creating window');
        createWindow();
    }
});

app.on('will-quit', () => {
    log.info('App will quit');
});

process.on('uncaughtException', (error) => {
    log.error('Uncaught Exception:', error);
});

ipcMain.handle('cleanup-processes', () => {
    cleanupProcesses();
});

ipcMain.handle('show-notification', (notificationTitle,notificationBody) => {
    showNotification(notificationTitle,notificationBody);
});


ipcMain.handle('run-background-process', async (event, command, params='') => {
    console.log('run-background-process invoked with command:', command);
    const backgroundProcess = spawn(command, [params], {
        stdio: 'inherit'
    });

    setCleanEvents(backgroundProcess,childBackgroundProcesses);
});

ipcMain.handle('run-powershell-command', async (event, command) => {
    console.log('run-powershell-command invoked with command:', command);
    return new Promise((resolve, reject) => {
        const child = exec(`powershell.exe ${command}`, async (error, stdout, stderr) => {
            /*if (error) {
                console.log(`STDERR::: `,stderr);
                console.log(`ERROR::: `,error.message,error.cause, error.stdout);
                console.log(`STDOUT::: `,JSON.stringify(stdout));
                reject(`${error}`);
                return error;
            }*/
            resolve(stdout || stderr);
        });
        setCleanEvents(child,childProcesses);
    });
});

ipcMain.handle('update-hosts-files-in-server', async (event, serverName, hostname) => {
    try {
        await updateHostsFilesInServer(serverName, hostname);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
});

ipcMain.handle('update-hosts-files-in-container', async (event, serverName, containerHostsDirPath, host) => {
    try {
        await updateHostsFilesInContainer(serverName, containerHostsDirPath, host);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
});

// Hook to run when the application is quitting
app.on('before-quit', () => {
    cleanupProcesses();
});

process.on('exit', () => {
    cleanupProcesses();
});

process.on('SIGINT', () => {
    cleanupProcesses();
    process.exit();
});

process.on('SIGTERM', () => {
    cleanupProcesses();
    process.exit();
});

async function killAllProcesses(processes) {
    const killPromises = processes.map(child => {
        return new Promise((resolve, reject) => {
            kill(child.pid, 'SIGTERM', (err) => {
                if (err) {
                    console.log('Erro ao terminar o processo XXXXXXXXXX: ', JSON.stringify(child));
                    console.log('Erro ao terminar o processo:', err,JSON.stringify(child));
                    reject(err);
                } else {
                    console.log(`Processo ${child.pid} terminado com sucesso.`);
                    resolve();
                }
            });
        });
    });

    await Promise.all(killPromises);
}

function cleanupProcesses() {
    killAllProcesses(childProcesses).then(() => {
        childProcesses = [];
        console.log('Todos os subprocessos foram terminados e removidos.');
    }).catch(err => {
        console.log('Erro ao terminar subprocessos:', err);
    });

    killAllProcesses(childBackgroundProcesses).then(() => {
        childBackgroundProcesses = [];
        console.log('Todos os subprocessos em background foram terminados e removidos.');
    }).catch(err => {
         console.log('Erro ao terminar subprocessos:', err);
    });

    killAllProcesses(childAsyncProcesses).then(() => {
        childAsyncProcesses = [];
        console.log('Todos os subprocessos assincronos foram terminados e removidos.');
    }).catch(err => {
         console.log('Erro ao terminar subprocessos:', err);
    });
}

function startChildProcess(command, args) {
    const child = exec(`${command} ${args}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao executar comando ${command}:`, error);
            return;
        }
        console.log(`Comando ${command} executado com sucesso.`);
    });

    childProcesses.push(child);
}

