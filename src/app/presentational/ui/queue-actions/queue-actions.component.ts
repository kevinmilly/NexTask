import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskEntryComponent } from '../task-entry/task-entry.component';
import { MatDialog } from '@angular/material/dialog';
import { BackendService } from '../../../shared/services/backend.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoalEntryComponent } from '../goal-entry/goal-entry.component';

@Component({
  selector: 'app-queue-actions',
  templateUrl: './queue-actions.component.html',
  styleUrls: ['./queue-actions.component.scss']
})
export class QueueActionsComponent implements OnInit {

  addTaskSub: Subscription;
  addGoalSub: Subscription;
  @Input() deviceSize;

  constructor(
              private router: Router, 
              private backend: BackendService, 
              private dialog:MatDialog,
              public snackbar: MatSnackBar ) { }
 
  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    console.log(`Device size in the queue actions element is ${this.deviceSize}`);
  }

  navigate(whereTo) {
    this.router.navigate([`/ui-display/${whereTo}/`]);
  }
  
  addTask() {
    const dialogRef = this.dialog.open(TaskEntryComponent, {
      width: '450px',
      disableClose: true
    });

    this.addTaskSub = dialogRef.afterClosed().subscribe(result => {
      console.dir(result);
      if(result !== null) {
        const returnItem = this.backend.addTask(result);
        const awards = this.backend.addMetric(returnItem,"creation");

      }
    });
  }

  addGoal() {
    const dialogRef = this.dialog.open(GoalEntryComponent, {
      width: '99%',
      height: '50em',
      disableClose: true
    });

    this.addGoalSub = dialogRef.afterClosed().subscribe(result => {
      console.log("In Queue actions after closing the add goal dialog we got: ");
      console.dir(result);
      if(result !== null) {
        const returnedGoals = this.backend.addGoals(result.goalsToSubmit);
        const returnedTasks = this.backend.addTasks(result.tasksToSubmit);

      }
    });
  }

  

  ngOnDestroy() {

    if(this.addTaskSub) {
      this.addTaskSub.unsubscribe();
    }
    if(this.addGoalSub) {
      this.addGoalSub.unsubscribe();
    }
  }

}
