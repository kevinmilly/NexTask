import { NgModule } from "@angular/core";
import { TaskEntryComponent } from './ui/task-entry/task-entry.component';
import { ItemEditComponent } from './ui/item-edit/item-edit.component';

import { SharedModule } from '../shared/shared.module';
import { IdeaEntryComponent } from './ui/idea-entry/idea-entry.component';
import { BatchTaskEntryComponent } from './ui/batch-task-entry/batch-task-entry.component';
import { ShowAwardComponent } from './display/show-award/show-award.component';
import { GoalEntryComponent } from './ui/goal-entry/goal-entry.component';

import { MetricsComponent } from './display/metrics/metrics.component';
import { ListViewComponent } from "./display/list-view/list-view.component";
import { MilestoneEntryComponent } from "./ui/milestone-entry/milestone-entry.component";
import { DateTimeEntryComponent } from "./ui/date-time-entry/date-time-entry.component";


@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        TaskEntryComponent,
        ItemEditComponent,
        DateTimeEntryComponent,
        IdeaEntryComponent,
        MetricsComponent,
        BatchTaskEntryComponent,
        ShowAwardComponent,
        GoalEntryComponent,
        ListViewComponent,
        MilestoneEntryComponent
        
        
    ],
    entryComponents: [
        TaskEntryComponent,
        ItemEditComponent,
        DateTimeEntryComponent,
        GoalEntryComponent,
        ShowAwardComponent,
        MilestoneEntryComponent
    ],
    exports:[
        TaskEntryComponent,
        ItemEditComponent,
        IdeaEntryComponent,
        DateTimeEntryComponent,
        BatchTaskEntryComponent,
        ShowAwardComponent,
        GoalEntryComponent,
        ListViewComponent,
        MetricsComponent,
        MilestoneEntryComponent
    ]

})
export class PresentationalModule {}