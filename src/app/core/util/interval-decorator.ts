export function Interval(seconds: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // Execute imediatamente
            originalMethod.apply(this, args);

            // Store the interval ID
            const intervalId = setInterval(() => {
                originalMethod.apply(this, args);
            }, seconds * 1000);

            // Store the interval ID in the target instance
            if (!this._intervals) {
                this._intervals = [];
            }
            this._intervals.push(intervalId);

            // Override ngOnDestroy to clear the interval
            const originalNgOnDestroy = this.ngOnDestroy;
            this.ngOnDestroy = function () {
                if (originalNgOnDestroy) {
                    originalNgOnDestroy.apply(this);
                }
                if (this._intervals) {
                    this._intervals.forEach(clearInterval);
                }
            };
        };

        return descriptor;
    };
}
