import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';
import { CorpHorizontalNavigationComponent } from 'corp/components/navigation/horizontal/horizontal.component';
import { CorpNavigationService } from 'corp/components/navigation/navigation.service';
import { CorpNavigationItem } from 'corp/components/navigation/navigation.types';
import { CorpUtilsService } from 'corp/services/utils/utils.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector       : 'corp-horizontal-navigation-basic-item',
    templateUrl    : './basic.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [NgClass, NgIf, RouterLink, RouterLinkActive, MatTooltipModule, NgTemplateOutlet, MatMenuModule, MatIconModule],
})
export class CorpHorizontalNavigationBasicItemComponent implements OnInit, OnDestroy
{
    @Input() item: CorpNavigationItem;
    @Input() name: string;

    isActiveMatchOptions: IsActiveMatchOptions;
    private _corpHorizontalNavigationComponent: CorpHorizontalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _corpNavigationService: CorpNavigationService,
        private _corpUtilsService: CorpUtilsService,
    )
    {
        // Set the equivalent of {exact: false} as default for active match options.
        // We are not assigning the item.isActiveMatchOptions directly to the
        // [routerLinkActiveOptions] because if it's "undefined" initially, the router
        // will throw an error and stop working.
        this.isActiveMatchOptions = this._corpUtilsService.subsetMatchOptions;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Set the "isActiveMatchOptions" either from item's
        // "isActiveMatchOptions" or the equivalent form of
        // item's "exactMatch" option
        this.isActiveMatchOptions =
            this.item.isActiveMatchOptions ?? this.item.exactMatch
                ? this._corpUtilsService.exactMatchOptions
                : this._corpUtilsService.subsetMatchOptions;

        // Get the parent navigation component
        this._corpHorizontalNavigationComponent = this._corpNavigationService.getComponent(this.name);

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Subscribe to onRefreshed on the navigation component
        this._corpHorizontalNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll),
        ).subscribe(() =>
        {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
