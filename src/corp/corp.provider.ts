import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ENVIRONMENT_INITIALIZER, EnvironmentProviders, importProvidersFrom, inject, Provider } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CORP_MOCK_API_DEFAULT_DELAY, mockApiInterceptor } from 'corp/lib/mock-api';
import { CorpConfig } from 'corp/services/config';
import { CORP_CONFIG } from 'corp/services/config/config.constants';
import { CorpConfirmationService } from 'corp/services/confirmation';
import { corpLoadingInterceptor, CorpLoadingService } from 'corp/services/loading';
import { CorpMediaWatcherService } from 'corp/services/media-watcher';
import { CorpPlatformService } from 'corp/services/platform';
import { CorpSplashScreenService } from 'corp/services/splash-screen';
import { CorpUtilsService } from 'corp/services/utils';

export type CorpProviderConfig = {
    mockApi?: {
        delay?: number;
        services?: any[];
    },
    corp?: CorpConfig
}

/**
 * Corp provider
 */
export const provideCorp = (config: CorpProviderConfig): Array<Provider | EnvironmentProviders> =>
{
    // Base providers
    const providers: Array<Provider | EnvironmentProviders> = [
        {
            // Disable 'theme' sanity check
            provide : MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme  : false,
                version: true,
            },
        },
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill',
            },
        },
        {
            provide : CORP_MOCK_API_DEFAULT_DELAY,
            useValue: config?.mockApi?.delay ?? 0,
        },
        {
            provide : CORP_CONFIG,
            useValue: config?.corp ?? {},
        },

        importProvidersFrom(MatDialogModule),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(CorpConfirmationService),
            multi   : true,
        },

        provideHttpClient(withInterceptors([corpLoadingInterceptor])),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(CorpLoadingService),
            multi   : true,
        },

        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(CorpMediaWatcherService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(CorpPlatformService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(CorpSplashScreenService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(CorpUtilsService),
            multi   : true,
        },
    ];

    // Mock Api services
    if ( config?.mockApi?.services )
    {
        providers.push(
            provideHttpClient(withInterceptors([mockApiInterceptor])),
            {
                provide   : APP_INITIALIZER,
                deps      : [...config.mockApi.services],
                useFactory: () => (): any => null,
                multi     : true,
            },
        );
    }

    // Return the providers
    return providers;
};
