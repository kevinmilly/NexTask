import { NgModule } from "@angular/core";
import { TaskEntryComponent } from './ui/task-entry/task-entry.component';
import { TaskEditComponent } from './ui/task-edit/task-edit.component';
import { SettingsComponent } from './ui/settings/settings.component';
import { SharedModule } from '../shared/shared.module';
import { IdeaEntryComponent } from './ui/idea-entry/idea-entry.component';
import { BatchTaskEntryComponent } from './ui/batch-task-entry/batch-task-entry.component';
import { ShowAwardComponent } from './display/show-award/show-award.component';
import { GoalEntryComponent } from './ui/goal-entry/goal-entry.component';
import { ActionButtonsComponent } from './ui/action-buttons/action-buttons.component';
import { MetricsComponent } from './display/metrics/metrics.component';


@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        TaskEntryComponent,
        TaskEditComponent,
        SettingsComponent,
        IdeaEntryComponent,
        MetricsComponent,
        BatchTaskEntryComponent,
        ShowAwardComponent,
        GoalEntryComponent,
        ActionButtonsComponent
        
    ],
    entryComponents: [
        TaskEntryComponent,
        TaskEditComponent,
        GoalEntryComponent,
        ShowAwardComponent,
        SettingsComponent 
    ],
    exports:[
        TaskEntryComponent,
        TaskEditComponent,
        SettingsComponent,
        IdeaEntryComponent,
        BatchTaskEntryComponent,
        ShowAwardComponent,
        GoalEntryComponent,
        ActionButtonsComponent,
        MetricsComponent
    ]

})
export class PresentationalModule {}