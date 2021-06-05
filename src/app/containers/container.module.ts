import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HoursSumPipe } from './pipes/hours-sum.pipe';
import { QueueContainerComponent } from './queue-container/queue-container.component';
import { TaskContainerComponent } from './task-container/task-container.component';
import {BdcWalkModule} from 'bdc-walkthrough';

@NgModule({
    imports:[SharedModule,BdcWalkModule],
    exports:[TaskContainerComponent, QueueContainerComponent],
    declarations:[
        TaskContainerComponent, 
        QueueContainerComponent,
        HoursSumPipe
    ]
})
export class ContainerModule {}