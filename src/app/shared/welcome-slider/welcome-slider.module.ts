import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeSliderPageRoutingModule } from './welcome-slider-routing.module';

import { WelcomeSliderPage } from './welcome-slider.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeSliderPageRoutingModule
  ],
  declarations: [WelcomeSliderPage]
})
export class WelcomeSliderPageModule {

  slideOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };


}
