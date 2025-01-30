import {Component, Input} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {Observable} from 'rxjs';


/**
 * Componente para apresentar mensagem de Erro
 *
 * Caso exista validadores do formGroup que emite valor do tipo Observable(TranslateService) o mesmo vai ser apresentado respeitando
 * internacionalização (i18n)
 *
 * Caso utilizado validadores da class {@link Validators} existe mensagens mapeadas no método {@link MsgErroComponent.getMsgErrorValidator}
 * para cada tipo.
 *
 * É possível enviar mensagem customizada pelo input {@link MsgErroComponent.customMsg}
 */
@Component({
  selector: 'sc-msg-erro',
  templateUrl: './msg-erro.component.html',
  styleUrls: ['./msg-erro.component.css']
})
export class MsgErroComponent {

  @Input()
  control: AbstractControl;

  @Input()
  customMsg;

  listaMensagemErrorsControl: Array<string>;

  constructor() {
  }

  /**
   * Verifica e popula lista de erros para apresentação no template do componente
   */
  hasError(): boolean {
    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      this.listaMensagemErrorsControl = [];

      for (const propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && (this.control.touched || this.control.dirty)) {
          if (this.customMsg) {
            this.listaMensagemErrorsControl.push(this.customMsg);
          } else if (this.control.errors[propertyName]) {
            if (this.control.errors[propertyName] instanceof Observable) {
              this.control.errors[propertyName].subscribe(resposta => {
                this.listaMensagemErrorsControl.push(resposta);
              });
            } else {
              this.listaMensagemErrorsControl.push(this.getMsgErrorValidator(propertyName, this.control.errors[propertyName]));
            }
          }
        }
      }
      return true;
    }
    return false;
  }

  /**
   * recupera mensagem para validadores da class {@link Validators}
   * @param validatorName
   * @param validatorValue
   */
  getMsgErrorValidator(validatorName: string, validatorValue?: any) {
    // mapa de mensagem para cada tipo de validação
    const config = {
      'required': `Campo é obrigatório.`,
      'minlength': `Campo precisa ter no mínimo ${validatorValue.requiredLength} caracteres.`,
      'maxlength': `Campo precisa ter no máximo ${validatorValue.requiredLength} caracteres.`,
      'cepInvalido': 'CEP inválido.',
      'emailInvalido': 'Email já cadastrado!',
      'equalsTo': 'Campos não são iguais',
      'pattern': 'Campo inválido'
    };
    return config[validatorName];
  }
}
