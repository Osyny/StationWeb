import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Injector,
  Renderer2,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AppComponentBase } from '../app-component-base';
import { ValidationError } from './validation.api';

@Component({
  selector: 'validation-summary',
  templateUrl: './validation-summary.component.html',
})
export class ValidationSummaryComponent
  extends AppComponentBase
  implements OnInit
{
  readonly admin: string = 'admin';
  defaultValidationErrors: Partial<ValidationError>[] = [
    { name: 'required', localizationKey: 'This field is required' },
    {
      name: 'minlength',
      localizationKey: 'PleaseEnterAtLeastNCharacter',
      propertyKey: 'requiredLength',
    },
    {
      name: 'maxlength',
      localizationKey: 'PleaseEnterNoMoreThanNCharacter',
      propertyKey: 'requiredLength',
    },
    {
      name: 'email',
      localizationKey: 'Invalid Email Address',
    },
    {
      name: 'pattern',
      localizationKey: 'Entered value is not correct',
      propertyKey: 'requiredPattern',
    },
    {
      name: 'validateEqual',
      localizationKey: 'PairsDoNotMatch',
    },
  ];
  validationErrors = <ValidationError[]>this.defaultValidationErrors;

  @Input() title: string = '';
  @Input()
  control: any;
  @Input() controlEl: any;
  @Output() isValidationError = new EventEmitter<boolean>();

  constructor(injector: Injector, public _renderer: Renderer2) {
    super(injector);
  }

  //  @Input() customValidationErrors: any;

  @Input() set customValidationErrors(val: ValidationError[]) {
    if (val && val.length > 0) {
      const defaults = this.defaultValidationErrors.filter(
        (defaultValidationError) =>
          !val.find(
            (customValidationError) =>
              customValidationError.name === defaultValidationError.name
          )
      );
      this.validationErrors = <ValidationError[]>[...defaults, ...val];
    }
  }

  isError(validationError: ValidationError): boolean {
    let result: boolean = false;
    if (this.control?.errors) {
      result = this.control?.errors[validationError.name];
    }
    return result;
  }

  getValidationError(validationError: ValidationError) {
    let result = '';
    if (this.control?.errors) {
      result = this.control?.errors[validationError.name];
    }

    return result;
  }

  ngOnInit() {
    if (this.controlEl) {
      this.control?.valueChanges.subscribe(() => {
        if (
          this.control?.valid &&
          (this.control.dirty || this.control.touched)
        ) {
          this._renderer.removeClass(this.controlEl, 'is-invalid');
        }
      });
    }
  }

  getValidationErrorMessage(error: ValidationError): string {
    if (this.controlEl) {
      this._renderer.addClass(this.controlEl, 'is-invalid');
    }
    let propertyValue = '';
    if (this.control?.errors && this.defaultValidationErrors) {
      let result = this.control.errors[error.name];
      // if (this.customValidationErrors) {
      //   const errorValue = this.customValidationErrors[0];
      //   if (errorValue) {
      //     this.isValidationError.emit(true);
      //     return errorValue?.localizationKey ? errorValue?.localizationKey : '';
      //   }
      // }

      const errorValue = this.defaultValidationErrors?.find(
        (err) => err?.name === error?.name
      );
      if (errorValue) {
        this.isValidationError.emit(true);
        return error?.localizationKey ? error?.localizationKey : '';
      }
    }
    if (this.control?.value === '' && error.name === 'validateEqual') {
      return '';
    }
    //   let result = propertyValue;
    // ? this.l(error.localizationKey, propertyValue)
    // : this.l(error.localizationKey);
    this.isValidationError.emit(false);
    return propertyValue;
  }
}
