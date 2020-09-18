import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EShopFormService } from 'src/app/services/e-shop-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { EShopValidator } from 'src/app/Validators/e-shop-validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];
  
  countries: Country[] =[];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  
  constructor(private formBuilder: FormBuilder,
              private eshopFormService: EShopFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({

        firstName: new FormControl('', [Validators.required, Validators.minLength(2), EShopValidator.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), EShopValidator.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, 
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      shippingAddress: this.formBuilder.group({

        street: new FormControl('', [Validators.required, Validators.minLength(2), EShopValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), EShopValidator.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), EShopValidator.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required])
        
      }),

      billingAddress: this.formBuilder.group({
        
        street: new FormControl('', [Validators.required, Validators.minLength(2), EShopValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), EShopValidator.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), EShopValidator.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required])
                
      }),

      creditCard: this.formBuilder.group({

        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), EShopValidator.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']

      })
    });

    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("Start Month: " + startMonth);

    this.eshopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );


    //populate credit card years
    this.eshopFormService.getCreditCardYear().subscribe(
      data => {
        console.log("Retrieved credit card Years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    //populate Countries
    this.eshopFormService.getCountries().subscribe(
      data => {
        console.log("Retrived Countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  
  }

  // getters for customer
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  
  // getters for shipping
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  
  //getters for billing
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  
  // getters for Credit card
  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  
  


  copyShippingAddressToBillingAddress(event){

    if(event.target.checked) {
      
        this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
        this.billingAddressStates = this.shippingAddressStates;
    
      } else {
    
        this.checkoutFormGroup.controls.billingAddress.reset();
        
        this.billingAddressStates = [];
    }

  }

  onSubmit() {

    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The Email Address is " + this.checkoutFormGroup.get('customer').value.email);

    console.log("CheckOut Form Group is valid: " + this.checkoutFormGroup.valid);

  }

  handleMonthsAndYear() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    //if current Year equals the selected year, then start with current year
    if(currentYear === selectedYear ) {
      startMonth = new Date().getMonth() + 1;
    }
     else {
       startMonth = 1;
     }

     this.eshopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.eshopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data; 
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }
}



