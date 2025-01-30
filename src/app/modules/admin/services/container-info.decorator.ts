import {ContainerInfo} from "app/modules/admin/services/ContainerInfo";

export function ContainerInfoDecorator(target: any, propertyKey: string) {
    let value: any;

    const getter = () => value;
    const setter = (newValue: any) => {
        value = {
            id: newValue.Id || '',
            name: newValue.Name || '',
            created: newValue.Created || '',
            state: {
                status: newValue.State?.Status || '',
                running: newValue.State?.Running || false,
                paused: newValue.State?.Paused || false,
                restarting: newValue.State?.Restarting || false,
                oOMKilled: newValue.State?.OOMKilled || false,
                dead: newValue.State?.Dead || false,
                pid: newValue.State?.Pid || 0,
                exitCode: newValue.State?.ExitCode || 0,
                error: newValue.State?.Error || '',
                startedAt: newValue.State?.StartedAt || '',
                finishedAt: newValue.State?.FinishedAt || '',
            }
        } as ContainerInfo;
    };

    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
}
