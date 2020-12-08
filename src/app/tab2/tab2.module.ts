
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PresentationalModule } from '../presentational/presentational-module';

@NgModule({
  imports: [
    SharedModule,
    Tab2PageRoutingModule,
    PresentationalModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
