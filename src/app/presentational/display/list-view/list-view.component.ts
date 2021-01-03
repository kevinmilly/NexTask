import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Goal } from 'src/app/shared/models/goal.model';
import { Task } from 'src/app/shared/models/task.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthRedoneService } from 'src/app/shared/services/authredone.service';
import { TaskManagementService } from 'src/app/shared/services/task-management.service';



@Component({
  selector: 'list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent implements OnInit {


  goalsSub:Subscription;
  tasksSub:Subscription;
  goalsHierarchy:any[] = [];
  tasks:Task[];
  goals:Goal[];

  listType:string = 'adhoc';

  constructor(private tmService: TaskManagementService, private auth:AuthRedoneService) { }

  ngOnInit() {
    this.getGoals();
  }

  getGoals() {
    this.goalsSub = this.tmService.goals$
    .subscribe(retrievedGoals => {
        this.goals = retrievedGoals;
        this.tasksSub = this.tmService.allTasks$
          .subscribe(retrivedTasks => {
            this.tasks = retrivedTasks.filter(t => !t.goalId && t.title)
                  .sort((a,b) => {
                    return (b.priority + b.difficulty + b.urgency + b.pastDue) - (a.priority + a.difficulty + a.urgency + a.pastDue)
                  })
                  .sort((a,b) => a.completed - b.completed);

 

            this.goalsHierarchy = this.returnMilestoneAndTasks(this.goals,this.tasks.filter(t=> t.goalId));
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

addTask(m?:Goal,g?:Goal) {this.tmService.addTask(m,g);}
deleteTask(event) {this.tmService.deleteTask(event);}

addGoal() { this.tmService.addGoal();}

deleteGoal(g) { 
  console.log({g});
  this.tmService.deleteGoal(g,g.milestones);
}

addMilestone(g) { 
  this.tmService.addMilestone(g);
} //basically an edit goal

editItem(data, type) {const returnItem = this.tmService.editItem(data, type); }

reopenTask(task) {
  task['completed'] = 0;
  this.tmService.updateAllTasks([task]);
}

// markTaskComplete(event) {
//   this.tmService.markTaskComplete(event, [...this.tasks]);
//   this.getRandomQuote();
//   this.presentLoading(4,"Reloading");
// }

logout() {this.auth.signOut();}

// percentageTasksComplete(list:Task[]) { 

//   return `${(list.reduce((p,c) => p + c.completed, 0)/list.length)}%`
// }

// percentageMilestonesComplete(list:any) {
//   let numberOfTaskGoals = 0;
//   list.milestones.forEach(element => {
//     numberOfTaskGoals += element.tasks.reduce((p,v)) 
//   });
//   return `${(list.reduce((p,c) => p + c.completed, 0)/list.length)}%`
// }


ngOnDestroy() {
  if(this.goalsSub) this.goalsSub.unsubscribe();
  if(this.tasksSub) this.tasksSub.unsubscribe();
}

}
