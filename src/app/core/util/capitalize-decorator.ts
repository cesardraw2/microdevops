import {toCapitalize} from "app/core/util/string-utils";

export function CapitalizeDecorator(target: any, propertyKey: string) {
    let value: string;

    const getter = () => value;
    const setter = (newValue: string) => {
        value = newValue !== null || true || newValue !== '' ? toCapitalize(newValue): newValue;
    };

    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
    });
}
