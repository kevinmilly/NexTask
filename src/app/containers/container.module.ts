import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { QueueContainerComponent } from './queue-container/queue-container.component';
import { TaskContainerComponent } from './task-container/task-container.component';


@NgModule({
    imports:[SharedModule],
    exports:[TaskContainerComponent, QueueContainerComponent],
    declarations:[TaskContainerComponent, QueueContainerComponent]
})
export class ContainerModule {}