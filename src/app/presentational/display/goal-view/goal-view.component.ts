import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Goal } from 'src/app/shared/models/goal.model';
import { Task } from 'src/app/shared/models/task.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TaskManagementService } from 'src/app/shared/services/task-management.service';



@Component({
  selector: 'goal-view',
  templateUrl: './goal-view.component.html',
  styleUrls: ['./goal-view.component.scss'],
})
export class GoalViewComponent implements OnInit {


  goalsSub:Subscription;
  tasksSub:Subscription;
  goalsHierarchy:any[] = [];

  constructor(private tmService: TaskManagementService, private auth:AuthService) { }

  ngOnInit() {
    this.getGoals();
  }

  getGoals() {
    this.goalsSub = this.tmService.goals$
    .subscribe(retrievedGoals => {
        this.tasksSub = this.tmService.allTasks$
          .subscribe(retrivedTasks => {
            this.goalsHierarchy = this.returnMilestoneAndTasks(retrievedGoals,retrivedTasks.filter(t=> t.goalId));
            // console.dir(this.goalsHierarchy);
          })
        
        
  
  })
}

returnMilestoneAndTasks(goals:Goal[],tasks:Task[]) {
  const milestones = goals.filter(g => g.parentGoal);
  const structures = [];


  milestones.forEach(mile => {
    mile['tasks'] = tasks.filter(t => t.goalId === mile.id);
  });

  goals.forEach(g => {
    if(!g.parentGoal) {
      g['milestones'] = milestones.filter(m => m.parentGoal === g.id);
      structures.push(g);
    }
  });
  // console.dir(structures);
  return structures;
}

addTask() {
  this.tmService.addTask();
}

editTask(event) {
  const returnItem = this.tmService.editTask(event);

 }

 deleteTask(event) {
    this.tmService.deleteTask(event);
 }

addGoal() { this.tmService.addGoal();}

logout() {this.auth.logout();}

ngOnDestroy() {
  if(this.goalsSub) this.goalsSub.unsubscribe();
  if(this.tasksSub) this.tasksSub.unsubscribe();
}

}
