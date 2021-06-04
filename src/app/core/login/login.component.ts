import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthRedoneService } from '../services/auth/authredone.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {

  deviceSize;
  authSub:Subscription;
  user:any;

  slideOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    speed: 3000
  };

  constructor(
      // public auth: AuthService, 
      public auth: AuthRedoneService,
      private router: Router,
      
 
    ) { }

  ngOnInit(): void {


  }

  signIn() {
    this.auth.login();
  
   
  }


signOut() {
  this.auth.signOut();
  this.router.navigate(['/login']);
}

ngOnDestroy() {
  if(this.authSub) this.authSub.unsubscribe();
}



}
