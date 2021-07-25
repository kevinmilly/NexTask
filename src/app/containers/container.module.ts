import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { QueueContainerComponent } from './queue-container/queue-container.component';
import { TaskContainerComponent } from './task-container/task-container.component';
import {BdcWalkModule} from 'bdc-walkthrough';
import { ClassPriorityPipe } from './pipes/class-priority.pipe';
import { TaskHeightPipe } from './pipes/task-height.pipe';


@NgModule({
    imports:[SharedModule,BdcWalkModule],
    exports:[TaskContainerComponent, QueueContainerComponent],
    declarations:[
        TaskContainerComponent, 
        QueueContainerComponent,
        ClassPriorityPipe,
        TaskHeightPipe
    ]
})
export class ContainerModule {}