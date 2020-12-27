import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-slider',
  templateUrl: './welcome-slider.page.html',
  styleUrls: ['./welcome-slider.page.scss'],
})
export class WelcomeSliderPage implements OnInit {

  slideOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    speed: 10000
  };

  constructor(private router: Router) {}



  ngOnInit() {
  }

  // nextSlide() {
  //   this.slides.slideNext();
  // }

  start() {
    this.router.navigate(['login']);
  }

}
