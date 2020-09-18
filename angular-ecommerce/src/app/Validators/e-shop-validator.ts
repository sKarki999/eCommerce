import { ValidationErrors, FormControl } from '@angular/forms';

export class EShopValidator {

    //whitespace validation

    static notOnlyWhitespace(control: FormControl) : ValidationErrors {

        // check if string contains only white spaces
        if(control.value != null && (control.value.trim().length === 0)) {

            // invalid, return error object
            return { 'notOnlyWhitespace' : true };

        } else {

            // valid, return null
            return null;
        }
        
    }

}
