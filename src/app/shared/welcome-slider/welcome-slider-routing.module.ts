import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPageModule } from 'src/app/tabs/tabs.module';

import { WelcomeSliderPage } from './welcome-slider.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomeSliderPage
  },
  {
    path: 'tabs',
    component: TabsPageModule
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeSliderPageRoutingModule {}
