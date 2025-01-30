import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LogInstallService {
    private logContent = signal<string>('');

    getLogContent() {
        return this.logContent;
    }

    writeLog(message: string) {
        console.log('>>>>LOG<<<< ',message);
        this.logContent.update(current => current + '\n' + message + '\n');
    }
}
