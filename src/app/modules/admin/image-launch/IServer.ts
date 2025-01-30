export interface IServer {
    name: string|null,
    disk: string,
    mem: string,
    cpus: number,
    cloudInitPath: string | null
}
