import {IServer} from "app/modules/admin/image-launch/IServer";

export class Server implements IServer {
    name: string='new-server';
    disk: string='20G';
    mem: string='2G';
    cpus: number=2;
    cloudInitPath: string;
}
