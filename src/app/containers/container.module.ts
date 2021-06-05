import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HoursSumPipe } from './pipes/hours-sum.pipe';
import { QueueContainerComponent } from './queue-container/queue-container.component';
import { TaskContainerComponent } from './task-container/task-container.component';


@NgModule({
    imports:[SharedModule],
    exports:[TaskContainerComponent, QueueContainerComponent],
    declarations:[
        TaskContainerComponent, 
        QueueContainerComponent,
        HoursSumPipe
    ]
})
export class ContainerModule {}