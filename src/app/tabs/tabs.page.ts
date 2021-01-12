import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Goal } from '../shared/models/goal.model';
import { Task } from '../shared/models/task.model';
import { AuthRedoneService } from '../shared/services/authredone.service';
import { TaskManagementService } from '../shared/services/task-management.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  checkTask: Subscription;
  checkGoal: Subscription;
  goals:Goal[];
  tasks:Task[];

  constructor(private tmService: TaskManagementService, private auth:AuthRedoneService) {}

  ngOnInit() {
    if(this.auth.user) {
      this.checkGoal = this.tmService.goals$.subscribe(goals => this.goals = goals);
      this.checkTask = this.tmService.allTasks$.subscribe(tasks => this.tasks = tasks);
    }
 
  }

  ngOnDestroy() {
    if(this.checkTask) this.checkTask.unsubscribe();
    if(this.checkGoal) this.checkGoal.unsubscribe()
  }

}
