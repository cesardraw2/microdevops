export interface ServerInfo {
    name?: string;
    state?: string;
    snapshots?: number;
    ipv4?: string[];
    release?: string;
    imageHash?: string;
    cpus?: number;
    load?: string[];
    diskUsage?: string;
    memoryUsage?: string;
    mounts?: string[];
    error?: string;
}
