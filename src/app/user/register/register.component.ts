import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IUser from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CountryService } from 'src/app/services/country.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  countries: any[] = [];
  constructor(private countryService: CountryService, 
              private auth: AuthService,
              private emailTaken: EmailTaken) {}

  ngOnInit(): void {
    this.countryService.getFormattedCountries().subscribe(data => {
      this.countries = data;
    });
  }

  Name = new FormControl('', [Validators.required, Validators.minLength(4)]);
  Email = new FormControl('', [ Validators.required,Validators.email], [this.emailTaken.validate]);
  Age = new FormControl<number | null>(null, [Validators.required, Validators.min(18)]);
  Password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  ConfirmPassword = new FormControl('', [Validators.required]);
  PhoneNumber = new FormControl('', [Validators.required, Validators.pattern(/^\d{8}$/)]);
  Gender = new FormControl('', Validators.required);
  Country = new FormControl('', Validators.required);

  RegisterForm = new FormGroup({
    Name: this.Name,
    Email: this.Email,
    Age: this.Age,
    Password: this.Password,
    ConfirmPassword: this.ConfirmPassword,
    PhoneNumber: this.PhoneNumber,
    Gender: this.Gender,
    Country: this.Country
  },[RegisterValidators.match('Password','ConfirmPassword')]);

  showAlert = false 
  alertMsg = 'Please wait! Your account is being created.'
  alertColor = 'blue'
  insubmition = false
  async register() {
    this.showAlert = true
    this.alertMsg = 'Please wait! Your account is being created.'
    this.alertColor = 'blue'
    try
    {
      await this.auth.createUser(this.RegisterForm.value as IUser)
    }
    catch(e)
    {
      console.error(e)
      this.alertMsg = "Oops, please try again !!  "
      this.alertColor = "red"
      return
    }
    this.alertMsg = "Register Success"
    this.alertColor = "green"
  }

}
