import {context, trace} from '@opentelemetry/api';
import { Observable, BehaviorSubject, Subject, ReplaySubject, AsyncSubject } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { tracerProvider } from 'app/core/telemetry/tracing';
import {Span} from "@opentelemetry/api/build/esnext";

//import {Span} from "@opentelemetry/sdk-trace-base";

//import { requestCount } from '../../../../metrics-server';

export function TraceMethod(name: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const tracer = tracerProvider.getTracer('microdevops-app-tracer');
            const span: Span = tracer.startSpan(name) as Span;
            return context.with(trace.setSpan(context.active(), span), () => {
                try {
                    const result = originalMethod.apply(this, args);

                    if (result instanceof Promise) {
                        return result.finally(() => {
                            span.end();
                        });
                    } else if (
                        result instanceof Observable ||
                        result instanceof BehaviorSubject ||
                        result instanceof Subject ||
                        result instanceof ReplaySubject ||
                        result instanceof AsyncSubject
                    ) {
                        return result.pipe(
                            finalize(() => span.end()),
                            catchError(error => {
                                span.recordException(error);
                                span.end();
                                throw error;
                            })
                        );
                    } else {
                        span.end();
                        return result;
                    }
                } catch (error) {
                    span.recordException(error);
                    span.end();
                    throw error;
                }
            });
        };

        return descriptor;
    };
}

export function MetricMethod(name: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const boundFn = originalMethod.bind(this);
            const result = boundFn(...args);

            //## requestCount.inc(); // Incrementa a métrica a cada chamada do método

            if (result instanceof Promise) {
                return result.finally(() => {
                    // Adicional lógica para Promises se necessário
                });
            } else if (
                result instanceof Observable ||
                result instanceof BehaviorSubject ||
                result instanceof Subject ||
                result instanceof ReplaySubject ||
                result instanceof AsyncSubject
            ) {
                return result.pipe(
                    finalize(() => {
                        // Adicional lógica para Observables se necessário
                    }),
                    catchError(error => {
                        throw error;
                    })
                );
            } else {
                return result;
            }
        };

        return descriptor;
    };
}
