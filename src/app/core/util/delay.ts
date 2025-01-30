export function Delay(milliseconds: number): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(originalMethod.apply(this, args));
                }, milliseconds);
            });
        };

        return descriptor;
    };
}
