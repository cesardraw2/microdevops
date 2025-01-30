import {convertKeysToCamelCase, toCamelCase} from "app/core/util/string-utils";

export function ConverterDecorator<T>(target: any, propertyKey: string) {
    let value: T;

    const getter = () => value;
    const setter = (newValue: any) => {
        value = {} as T;
        convertKeysToCamelCase(newValue, value);
    };

    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
}
//@TODO Parei aqui
export function convertToClass<T>(input: any): T {
    const output: T = {} as T;
    for (const key in input) {
        if (input.hasOwnProperty(key)) {
            const camelCaseKey = toCamelCase(key);
            (output as any)[camelCaseKey] = input[key];
        }
    }
    return output;
}
