import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { trace, context } from '@opentelemetry/api';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const tracer = trace.getTracer('angular-http-tracer');
        const span = tracer.startSpan(`HTTP ${req.method} ${req.url}`);

        return context.with(trace.setSpan(context.active(), span), () => {
            return next.handle(req).pipe(
                tap({
                    next: event => {},
                    error: error => {
                        span.recordException(error);
                        span.end();
                    },
                    complete: () => {
                        span.end();
                    }
                })
            );
        });
    }
}
