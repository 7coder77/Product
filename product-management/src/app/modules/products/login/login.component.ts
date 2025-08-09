import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
loginEmail = '';
  loginPassword = '';
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  constructor(private apiservice:ApiService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('name');
  }

  login() {
    console.log('Login with', this.loginEmail, this.loginPassword);
    this.apiservice.post('/v1/auth/login', {
      email: this.loginEmail,
      password: this.loginPassword
    }).subscribe((response:any) => {
      console.log('Login response:', response);
      localStorage.setItem('jwt_token', response['access_token']);
      localStorage.setItem('name', response['name']);
      this.router.navigate(['/home']); // Navigate to home after login
    }, (error) => {
      console.error('Login error:', error);
    });
  }

  register() {
    console.log('Register with', this.registerName, this.registerEmail, this.registerPassword);
    this.apiservice.post('/v1/auth/reg', {
      name: this.registerName,
      email: this.registerEmail,
      password: this.registerPassword
    }).subscribe((response:any) => {
      console.log('Register response:', response);
      this._snackBar.open(response['message'] + " Please Login using same details", "close");
    }, (error) => {
      console.error('Register error:', error);
    });
  }
}
