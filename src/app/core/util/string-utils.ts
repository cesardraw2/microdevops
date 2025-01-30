export function toCamelCase(input: string): string {
    return input
        .split(/[\s-_]+/)
        .map((word, index) => {
            if (index === 0) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
}

export function toCapitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}



export function isObject(item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export function convertKeysToCamelCase(obj: any, target: any): any {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const camelKey = toCamelCase(key);
            if (isObject(obj[key])) {
                target[camelKey] = {};
                convertKeysToCamelCase(obj[key], target[camelKey]);
            } else if (Array.isArray(obj[key])) {
                target[camelKey] = obj[key].map((item: any) => {
                    if (isObject(item)) {
                        const newItem = {};
                        convertKeysToCamelCase(item, newItem);
                        return newItem;
                    }
                    return item;
                });
            } else {
                target[camelKey] = obj[key];
            }
        }
    }
    return target;
}
