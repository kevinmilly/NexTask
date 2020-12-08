
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ContainerModule } from '../containers/container.module';
import { PresentationalModule } from '../presentational/presentational-module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    Tab1PageRoutingModule,
    ContainerModule,
    PresentationalModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
