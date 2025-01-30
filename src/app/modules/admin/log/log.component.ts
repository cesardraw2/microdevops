import {Component, effect, WritableSignal} from '@angular/core';
import {LogInstallService} from 'app/core/log/log-service.service';
import {MatButton} from "@angular/material/button";

@Component({
    selector: 'app-log',
    standalone: true,
    templateUrl: './log.component.html',
    imports: [
        MatButton
    ],
    styleUrls: ['./log.component.scss']
})
export class LogComponent {
    protected logContent: WritableSignal<string>;

    constructor(protected logService: LogInstallService) {
        this.logContent = this.logService.getLogContent();
        effect(() => {
            this.logContent();
        });
    }

    protected cleanLog(){
        this.logContent.update(current => '');
    }
}
