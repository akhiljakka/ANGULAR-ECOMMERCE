import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean=false;
  useFullName: string='';
  loggedInUser:any;
  storage:  Storage = sessionStorage;
  constructor(public _auth:AuthService) { }

  ngOnInit(): void {
    // subscribe to authentication state changes

    this._auth.isAuthenticated$.subscribe(
      (result) => {this.isAuthenticated = result
      }
    )
    if(this._auth.user$){
    this._auth.user$.subscribe((data)=>
      {

        this.loggedInUser = data;
        console.log('LoggedIn User is ' + JSON.stringify(this.loggedInUser));
        console.log('LoggedIn User is ' + JSON.stringify(this.loggedInUser.email));
        const theEmail = data?.email;
        this.storage.setItem('userEmail',JSON.stringify(theEmail));
        const userFullName = data?.name;

      })
  }}

}
