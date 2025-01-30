import { Injectable } from '@angular/core';
import { CorpDrawerComponent } from 'corp/components/drawer/drawer.component';

@Injectable({providedIn: 'root'})
export class CorpDrawerService
{
    private _componentRegistry: Map<string, CorpDrawerComponent> = new Map<string, CorpDrawerComponent>();

    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register drawer component
     *
     * @param name
     * @param component
     */
    registerComponent(name: string, component: CorpDrawerComponent): void
    {
        this._componentRegistry.set(name, component);
    }

    /**
     * Deregister drawer component
     *
     * @param name
     */
    deregisterComponent(name: string): void
    {
        this._componentRegistry.delete(name);
    }

    /**
     * Get drawer component from the registry
     *
     * @param name
     */
    getComponent(name: string): CorpDrawerComponent | undefined
    {
        return this._componentRegistry.get(name);
    }
}
