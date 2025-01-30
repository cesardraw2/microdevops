import {AlertService, Color} from '@sicoob/ui';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomAlertService {

  constructor(private alertService: AlertService) {
  }

  public abrirAlert(color: Color, message: string, duration?: number, icon?: string) {
    this.alertService.open(
      {
        message: message,
        duration: duration ? duration : 5000,
        color: color ? color : Color.DEFAULT,
        icon: icon ? icon : color === Color.SUCCESS ? 'mdi mdi-checkbox-marked-circle' : 'mdi mdi-alert',
        extraClasses: 'openAnimationAlert'
      }
    );
  }
}
