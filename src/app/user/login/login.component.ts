import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  Credentials = {
    Email: '',
    Password: ''
  };

  showAlert = false
  alertMsg = 'Please wait! We are logging you in.'
  alertColor = 'blue'
  inSubmission = false
  constructor(private auth: AngularFireAuth) { }

  async login(){
    this.showAlert = true
    this.alertMsg = 'Please wait! We are logging you in.'
    this.alertColor = 'blue'
    this.inSubmission = true

    try
    {
      await this.auth.signInWithEmailAndPassword(this.Credentials.Email, this.Credentials.Password)
    }
    catch(e)
    {
      this.inSubmission = false
      this.alertMsg = "Something Wrong"
      this.alertColor = 'red'
      return
    }
    this.alertMsg = "Success your are logged in"
    this.alertColor = "green"
  }
}
