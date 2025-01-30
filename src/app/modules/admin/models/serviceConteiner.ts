import {IServiceContainer} from "app/modules/admin/models/service-conteiner.types";
import {CapitalizeDecorator} from "app/core/util/capitalize-decorator";


export class ServiceConteiner implements IServiceContainer{
    public id:string|null;
    public label:string|null;
    @CapitalizeDecorator
    public status:string|null;
    public serviceName:string|null;
    public url:string|null;
    public order:number|null;
    public isCreated:boolean|null;
    public archType:string|null;
    public sourcePath:string|null;
    public isBackend:boolean|null;
    public libs:string[]|[];
    public hosts:string[]|[];
}
