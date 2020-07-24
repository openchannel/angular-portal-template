import { Directive } from '@angular/core';
import { Validator, FormControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appExpiredDateValidator]' ,
  providers: [{ provide: NG_VALIDATORS, useExisting: ExpiredDateValidatorDirective, multi: true }]
})
export class ExpiredDateValidatorDirective implements Validator {
debugger;
  validate(c: FormControl): ValidationErrors {
    let todaysDate = new Date();
    todaysDate.setDate(todaysDate.getDate() - 1);
    todaysDate.getTime();
    // if (c.value < todaysDate)) {
    //   return ;
    // }
    const isValid  = c.value && c.value < todaysDate ? false : true;
    const message = {
      'appExpiredDateValidator': {
        'message': 'Please fill valid current or future date'
      }
    };
    return isValid ? null : message;
  }


}
