import { Injectable } from '@angular/core';
import { services as servicesData } from 'app/mock-api/apps/micro-devops/service-conteiners/data';
import { assign, cloneDeep } from 'lodash-es';
import {ServiceConteiner} from "app/modules/admin/models/serviceConteiner";
import {CorpMockApiService, CorpMockApiUtils} from "corp/lib/mock-api";

@Injectable({providedIn: 'root'})
export class ServiceConteinerMockApi
{
    private _services: any[] = servicesData;

    /**
     * Constructor
     */
    constructor(private _corpMockApiService: CorpMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ services - GET
        // -----------------------------------------------------------------------------------------------------
        this._corpMockApiService
            .onGet('api/v1/services')
            .reply(() => [
                200,
                cloneDeep(this._services),
            ]);

        // -----------------------------------------------------------------------------------------------------
        // @ services - POST
        // -----------------------------------------------------------------------------------------------------
        this._corpMockApiService
            .onPost('api/v1/services')
            .reply(({request}) =>
            {
                // Get the service
                const newService:any = cloneDeep(request.body.service);

                // Generate a new GUID
                newService.id = CorpMockApiUtils.guid();

                // Unshift the new service
                this._services.unshift(newService);

                return [
                    200,
                    newService,
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ services - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._corpMockApiService
            .onPatch('api/v1/services')
            .reply(({request}) =>
            {
                // Get the id and service
                const id = request.body.id;
                const service = cloneDeep(request.body.service);

                // Prepare the updated service
                let updatedservice = null;

                // Find the service and update it
                this._services.forEach((item, index, services) =>
                {
                    if ( item.id === id )
                    {
                        // Update the service
                        services[index] = assign({}, services[index], service);

                        // Store the updated service
                        updatedservice = services[index];
                    }
                });

                return [
                    200,
                    updatedservice,
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ service - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._corpMockApiService
            .onDelete('api/v1/services')
            .reply(({request}) =>
            {
                // Get the id
                const id = request.params.get('id');

                // Find the service and delete it
                const index = this._services.findIndex(item => item.id === id);
                this._services.splice(index, 1);
                return [
                    200,
                    true,
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Services - GET
        // -----------------------------------------------------------------------------------------------------
        this._corpMockApiService
            .onGet('api/v1/services/all')
            .reply(() =>
            {
                // Clone the services
                const services = cloneDeep(this._services);

                // Sort the services by order
                services.sort((a:ServiceConteiner, b:ServiceConteiner) => a.order - b.order);

                return [
                    200,
                    services,
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Services Search - GET
        // -----------------------------------------------------------------------------------------------------
        this._corpMockApiService
            .onGet('api/v1/services/search')
            .reply(({request}) =>
            {
                // Get the search query
                const query = request.params.get('query');

                // Prepare the search results
                let results:any;

                // If the query exists...
                if ( query )
                {
                    // Clone the services
                    let services = cloneDeep(this._services);

                    // Filter the services
                    services = services.filter(service => service.title && service.title.toLowerCase().includes(query.toLowerCase()) || service.notes && service.notes.toLowerCase()
                        .includes(query.toLowerCase()));

                    // Mark the found chars
                    services.forEach((service) =>
                    {
                        const re = new RegExp('(' + query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')', 'ig');
                        service.title = service.title.replace(re, '<mark>$1</mark>');
                    });

                    // Set them as the search result
                    results = services;
                }
                // Otherwise, set the results to null
                else
                {
                    results = null;
                }

                return [
                    200,
                    results,
                ];
            });


        // -----------------------------------------------------------------------------------------------------
        // @ Service - GET
        // -----------------------------------------------------------------------------------------------------
        this._corpMockApiService
            .onGet('api/v1/service')
            .reply(({request}) =>
            {
                // Get the id from the params
                const id = request.params.get('id');

                // Clone the services
                const services = cloneDeep(this._services);

                // Find the service
                const service = services.find(item => item.id === id);

                return [
                    200,
                    service,
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Service - POST
        // -----------------------------------------------------------------------------------------------------
        this._corpMockApiService
            .onPost('api/v1/services')
            .reply(({request}) =>
            {
                // Generate a new service
                const newService:ServiceConteiner = {
                    id       : CorpMockApiUtils.guid(),
                    label: null,
                    status: null,
                    serviceName: null,
                    url: null,
                    order: null,
                    isCreated: null,
                    archType: null,
                    sourcePath: null,
                    isBackend: null,
                    libs:[],
                    hosts:[],
                };

                // Unshift the new service
                this._services.unshift(newService);

                // Go through the services and update their order numbers
                this._services.forEach((service, index) =>
                {
                    service.order = index;
                });

                return [
                    200,
                    newService,
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Service - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._corpMockApiService
            .onPatch('api/v1/services')
            .reply(({request}) =>
            {
                // Get the id and service
                const id = request.body.id;
                const service = cloneDeep(request.body.service);

                // Prepare the updated service
                let updatedService = null;

                // Find the service and update it
                this._services.forEach((item, index, services) =>
                {
                    if ( item.id === id )
                    {
                        // Update the service
                        services[index] = assign({}, services[index], service);

                        // Store the updated service
                        updatedService = services[index];
                    }
                });

                return [
                    200,
                    updatedService,
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Service - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._corpMockApiService
            .onDelete('api/v1/services')
            .reply(({request}) =>
            {
                // Get the id
                const id = request.params.get('id');

                // Find the service and delete it
                const index = this._services.findIndex(item => item.id === id);
                this._services.splice(index, 1);

                return [
                    200,
                    true,
                ];
            });
    }
}
