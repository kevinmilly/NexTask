import { NgModule } from "@angular/core";
import { TaskEntryComponent } from './ui/task-entry/task-entry.component';
import { TaskEditComponent } from './ui/task-edit/task-edit.component';

import { SharedModule } from '../shared/shared.module';
import { IdeaEntryComponent } from './ui/idea-entry/idea-entry.component';
import { BatchTaskEntryComponent } from './ui/batch-task-entry/batch-task-entry.component';
import { ShowAwardComponent } from './display/show-award/show-award.component';
import { GoalEntryComponent } from './ui/goal-entry/goal-entry.component';

import { MetricsComponent } from './display/metrics/metrics.component';
import { GoalViewComponent } from "./display/goal-view/goal-view.component";


@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        TaskEntryComponent,
        TaskEditComponent,
        IdeaEntryComponent,
        MetricsComponent,
        BatchTaskEntryComponent,
        ShowAwardComponent,
        GoalEntryComponent,
        GoalViewComponent
        
        
    ],
    entryComponents: [
        TaskEntryComponent,
        TaskEditComponent,
        GoalEntryComponent,
        ShowAwardComponent,
      
    ],
    exports:[
        TaskEntryComponent,
        TaskEditComponent,
        IdeaEntryComponent,
        BatchTaskEntryComponent,
        ShowAwardComponent,
        GoalEntryComponent,
        GoalViewComponent,
        MetricsComponent
    ]

})
export class PresentationalModule {}