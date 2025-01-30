import {BatchSpanProcessor, WebTracerProvider} from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import {Resource} from "@opentelemetry/resources";
import {SEMRESATTRS_SERVICE_NAME} from "@opentelemetry/semantic-conventions";
import {InstrumentationAbstract} from "@opentelemetry/instrumentation/build/esnext/instrumentation";
import {getWebAutoInstrumentations} from "@opentelemetry/auto-instrumentations-web";

const collectorOptions = {
    serviceName: "micro-devops-app",
    url: 'http://dev-server.mshome.net:14269/api/traces', // URL do coletor Jaeger ou outro backend
};

const tracerProvider  = new WebTracerProvider({
    resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: 'micro-devops-app',
    }),
});

const collectorExporter  = new OTLPTraceExporter(collectorOptions);

//tracerProvider .addSpanProcessor(new SimpleSpanProcessor(traceExporter));
tracerProvider .addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
tracerProvider .addSpanProcessor(new BatchSpanProcessor(collectorExporter , {
    maxQueueSize: 1000,
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30000,
    maxExportBatchSize: 512,
}));
tracerProvider .register();

try {
    registerInstrumentations({
        instrumentations: [
            new FetchInstrumentation(),
            new XMLHttpRequestInstrumentation(),
            getWebAutoInstrumentations()
        ],
    });
    console.log('Instrumentations registered.');
} catch (error) {
    console.error('Error registering instrumentations:', error);
}

export { tracerProvider };

