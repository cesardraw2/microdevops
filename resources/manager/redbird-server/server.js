process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const Redbird = require('redbird');
const fs = require('fs');


const proxy = new Redbird({
    port: 80,
    bunyan: false,
    xfwd: true, // Usar cabeçalhos X-Forwarded-*
    ssl: {
        // Ignorar certificados autoassinados
        letsencrypt: {
            path: 'certs',
            port: 9999
        },
        http2: true,
        ignoreCertErrors: true,
        secure: false,
        secureOptions: require('constants').SSL_OP_NO_TLSv1_2, // Optional: Disable SSL/TLS versions below TLSv1.2
        tls: {
            rejectUnauthorized: false
        }
    }
});

// Função para registrar os proxies a partir do arquivo hosts.json
function registerProxies() {
    fs.readFile(`resources\\manager\\services.json`, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo services.json:', err);
            return;
        }
        try {
            const services = JSON.parse(data).services;
            services.forEach(service => {
                const headers = {};
                headers.Host = service.internalHostName;
                const isSSL = service.protocol === 'https';
                const targetUrl = `${service.protocol}://${service.internalHostName}:${service.internalPort}`;
                proxy.register(`${service.protocol}://${service.externalHostName}`, targetUrl, {
                    ssl: isSSL,
                    headers:headers,
                    useTargetHostHeader:true
                });
                //*console.log(`Proxy registrado: ${service.protocol}://${service.externalHostName} -> ${targetUrl}`);
            });
        } catch (parseError) {
            console.error('Erro ao analisar o arquivo services.json:', parseError);
        }
    });
}

// Registrar os proxies
registerProxies();

console.log('Microdevops proxy running on http://localhost:80');
