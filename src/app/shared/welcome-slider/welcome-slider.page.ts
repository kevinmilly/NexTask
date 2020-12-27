import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-slider',
  templateUrl: './welcome-slider.page.html',
  styleUrls: ['./welcome-slider.page.scss'],
})
export class WelcomeSliderPage implements OnInit {

  constructor(private router: Router) {}



  ngOnInit() {
  }

  start() {
    this.router.navigate(['login']);
  }

}
