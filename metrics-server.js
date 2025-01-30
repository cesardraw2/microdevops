const express = require('express');
const promClient = require('prom-client');

const app = express();
const register = new promClient.Registry();

// Definindo uma métrica de contador
const requestCount = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total de requisições HTTP',
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.listen(3000, () => {
    console.log('Servidor de métricas rodando na porta 3000');
});

module.exports = { requestCount };
