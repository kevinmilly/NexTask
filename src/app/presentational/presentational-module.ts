import { NgModule } from "@angular/core";
import { TaskEntryComponent } from './ui/task-entry/task-entry.component';
import { ItemEditComponent } from './ui/item-edit/item-edit.component';

import { SharedModule } from '../shared/shared.module';
import { ShowAwardComponent } from './display/show-award/show-award.component';
import { GoalEntryComponent } from './ui/goal-entry/goal-entry.component';

import { MetricsComponent } from './display/metrics/metrics.component';
import { ListViewComponent } from "./display/list-view/list-view.component";
import { MilestoneEntryComponent } from "./ui/milestone-entry/milestone-entry.component";
import { DateTimeEntryComponent } from "./ui/date-time-entry/date-time-entry.component";
import { SettingsComponent } from "./ui/settings/settings.component";


@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        TaskEntryComponent,
        ItemEditComponent,
        DateTimeEntryComponent,
        MetricsComponent,
        ShowAwardComponent,
        GoalEntryComponent,
        ListViewComponent,
        MilestoneEntryComponent,
        SettingsComponent
        
        
    ],
    entryComponents: [
        TaskEntryComponent,
        ItemEditComponent,
        DateTimeEntryComponent,
        GoalEntryComponent,
        ShowAwardComponent,
        MilestoneEntryComponent,
        SettingsComponent
    ],
    exports:[
        TaskEntryComponent,
        ItemEditComponent,
        DateTimeEntryComponent,
        ShowAwardComponent,
        GoalEntryComponent,
        ListViewComponent,
        MetricsComponent,
        MilestoneEntryComponent,
        SettingsComponent
    ]

})
export class PresentationalModule {}