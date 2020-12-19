import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {

  deviceSize;

  constructor(
      public auth: AuthService, 
      private router: Router,
 
    ) { }

  ngOnInit(): void {
    // this.auth.user$.subscribe(user => {
    //   if(user) {
    //     console.log("authenticated");
    //     this.router.navigate(['queue']);
    //   }
    // })
    if(this.auth.isLoggedIn) {
      console.log("We are logged In");
      console.dir(this.auth);
      this.router.navigate(['tabs']);
    }


  }

  signIn() {
    this.auth.googleLogin();
    console.log("Logging In");
    this.router.navigate(['tabs']);
   
  }


signOut() {
  this.auth.logout();
  this.router.navigate(['/login']);
}

authCheck() {
  return this.auth.isLoggedIn
}

}