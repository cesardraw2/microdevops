const Docker = require('dockerode');
const WebSocket = require('ws');
const express = require('express');
const docker = new Docker();
const app = express();
const port = 3000;

// Configura o servidor HTTP
app.get('/', (req, res) => {
    res.send('PeterAndBrunoDraw');
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Configura o servidor WebSocket, reutilizando o servidor HTTP
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    let container;

    ws.on('message', async (message) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === 'serviceName') {
            const serviceName = parsedMessage.data;
            console.log(`Received service name: ${serviceName}`);
            container = docker.getContainer(serviceName);
        } else if (parsedMessage.type === 'command') {
            const command = parsedMessage.data;
            console.log(`Received command: ${command}`);

            if (container) {
                try {
                    const exec = await container.exec({
                        AttachStdout: true,
                        AttachStderr: true,
                        Cmd: ['sh', '-c', command]
                    });

                    const stream = await exec.start();

                    stream.on('data', (data) => {
                        ws.send(data.toString());
                    });

                    stream.on('end', () => {
                        ws.send('Command execution finished.');
                    });
                } catch (err) {
                    console.error(`Error during exec:`, err);
                    ws.send(`Error during exec: ${err.message}`);
                }
            } else {
                ws.send('No container selected.');
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log(`>>> WebSocket server is listening on ws://localhost:${port}`);
