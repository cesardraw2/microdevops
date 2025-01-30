export interface IServiceContainer
{
    id?: string;
    label?: string;
    name?: string;
    status?: string;
    url?: string;
    order?: number;
    serviceName?: string;
    isCreated?: boolean;
    archType?: string;
    sourcePath?: string;
    isBackend?: boolean;
    category?: string;
    isEnabled?: boolean;
    libs?: string[];
    hosts?: string[];
}
