import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

/*const metricExporter = new OTLPMetricExporter({
    url: 'http://dev-server.mshome.net:4318/v1/metrics',
});

const meterProvider = new MeterProvider({
    resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: 'micro-devops-app',
    }),
});

meterProvider.addMetricReader(new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 60000, // Intervalo de exportação em milissegundos (1 minuto)
}));

export const meter = meterProvider.getMeter('example-meter');

// Exemplo de criação de uma métrica
const requestCount = meter.createCounter('requests', {
    description: 'Contador de requisições HTTP',
});*/

/*export function countRequest() {
    requestCount.add(1);
}*/
