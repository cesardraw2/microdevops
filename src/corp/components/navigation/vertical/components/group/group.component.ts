import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CorpNavigationService } from 'corp/components/navigation/navigation.service';
import { CorpNavigationItem } from 'corp/components/navigation/navigation.types';
import { CorpVerticalNavigationBasicItemComponent } from 'corp/components/navigation/vertical/components/basic/basic.component';
import { CorpVerticalNavigationCollapsableItemComponent } from 'corp/components/navigation/vertical/components/collapsable/collapsable.component';
import { CorpVerticalNavigationDividerItemComponent } from 'corp/components/navigation/vertical/components/divider/divider.component';
import { CorpVerticalNavigationSpacerItemComponent } from 'corp/components/navigation/vertical/components/spacer/spacer.component';
import { CorpVerticalNavigationComponent } from 'corp/components/navigation/vertical/vertical.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector       : 'corp-vertical-navigation-group-item',
    templateUrl    : './group.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [NgClass, NgIf, MatIconModule, NgFor, CorpVerticalNavigationBasicItemComponent, CorpVerticalNavigationCollapsableItemComponent, CorpVerticalNavigationDividerItemComponent, forwardRef(() => CorpVerticalNavigationGroupItemComponent), CorpVerticalNavigationSpacerItemComponent],
})
export class CorpVerticalNavigationGroupItemComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_autoCollapse: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() autoCollapse: boolean;
    @Input() item: CorpNavigationItem;
    @Input() name: string;

    private _corpVerticalNavigationComponent: CorpVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _corpNavigationService: CorpNavigationService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the parent navigation component
        this._corpVerticalNavigationComponent = this._corpNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._corpVerticalNavigationComponent.onRefreshed.pipe(
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
