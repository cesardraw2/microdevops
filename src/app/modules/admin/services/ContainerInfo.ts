export interface ContainerInfo {
    id: string;
    name: string;
    created: string;
    state: {
        status: string;
        running: boolean;
        paused: boolean;
        restarting: boolean;
        oOMKilled: boolean;
        dead: boolean;
        pid: number;
        exitCode: number;
        error: string;
        startedAt: string;
        finishedAt: string;
    };
}
