import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {

  deviceSize;
  authSub: Subscription;
  user: any;

  slideOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    speed: 3000
  };

  ev: any;

  constructor(
    public auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.promptAppInstallation();

  }

  signIn() {
    this.auth.login();
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 10000);

  }


  signOut() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }

  promptAppInstallation() {
    fromEvent(window, 'beforeinstallprompt').subscribe((res: any) => {
      console.log(res);
      this.ev = res;

      if (this.ev) {
        this.ev.preventDefault();
        this.ev.prompt();
        this.ev.userChoice.then((choiceResult: { outcome: string }) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
  }



}
