
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { Tab3Page } from './tab3.page';


import { Tab3PageRoutingModule } from './tab3-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PresentationalModule } from '../presentational/presentational-module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab3PageRoutingModule,
    PresentationalModule
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
