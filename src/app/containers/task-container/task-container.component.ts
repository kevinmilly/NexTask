import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Task } from '../../shared/models/task.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ModalController } from '@ionic/angular';
import { TaskEntryComponent } from 'src/app/presentational/ui/task-entry/task-entry.component';



@Component({
  selector: 'app-task-container',
  templateUrl: './task-container.component.html',
  styleUrls: ['./task-container.component.scss']
})
export class TaskContainerComponent implements OnInit {

  @Input() tasks: Task[] = [];
  @Input() deviceSize: string = '';

  @Output() markedComplete: EventEmitter <Task> = new EventEmitter<Task>();
  @Output() taskUpdate = new EventEmitter();
  @Output() editTaskEmitter:  EventEmitter <Task> = new EventEmitter<Task>();
  @Output() deleteTask: EventEmitter <Task> = new EventEmitter<Task>();
  @Output() createdIdea: EventEmitter <Task> = new EventEmitter<Task>();

  panelOpenState: boolean = false;
  toolTipOptions = {
    'placement': 'left',
    'hide-delay': -300
  }

  constructor(
      public dialog: MatDialog,
      public modalController: ModalController
    ) { }

  ngOnInit(): void {
    console.dir(this.tasks);
  }


  // drop(event: CdkDragDrop<{title: string, poster: string}[]>) {
  //   this.tasks[event.currentIndex].priority = 0;
  //   console.log(`Before adding the priority to the ${this.tasks[event.currentIndex].title}`);
  //   console.dir(this.tasks[event.currentIndex]);
  //   this.tasks[event.currentIndex].priority = this.tasks[event.previousIndex].priority;
  //   // this.tasks[event.currentIndex].difficulty = this.tasks[event.previousIndex].difficulty;
  //   console.log(`After adding the priority to the ${this.tasks[event.currentIndex].title}`);
  //   console.dir(this.tasks[event.currentIndex]);
  //   moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  //   this.taskUpdate.emit([this.tasks[event.currentIndex]]);
  // }
  
  markComplete(task: Task) {
    this.markedComplete.emit(task);
  }

  delete(task: Task) {
    if(confirm("Do you legit wanna delete this?")) {
      this.deleteTask.emit(task);
    }
   
  }

  async editComplete(task: Task) {
  //   console.log({task});
  //   const dialogRef = this.dialog.open(TaskEditComponent, {
  //     width: '450px',
  //     height: '630px',
  //      data: {task}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log({result});
  //     // this.tasks.findIndex(t => t.id === task)
  //     this.editTaskEmitter.emit(result);
  //   });

      const modal = await this.modalController.create({
        component: TaskEntryComponent,
        componentProps: { data: task },
        cssClass: 'task-entry'
      });
      modal.onDidDismiss()
        .then((data) => {
          const result = data['data']; 
          if(result) this.editTaskEmitter.emit(result);
      });

    return await modal.present();
  }


  createIdea(task: Task) {
    this.createdIdea.emit(task); 
  }

  classPriority(priority, difficulty, urgency, pastDue) {
    if((priority + difficulty + urgency + pastDue) < 8 || (priority + difficulty + urgency + pastDue) === 8) { 
      return 'task-box very-low' 
    } else if((priority + difficulty + urgency + pastDue) < 12 || (priority + difficulty + urgency + pastDue) === 12) { 
        return 'task-box low';
    } else if((priority + difficulty + urgency + pastDue) < 18 || (priority + difficulty + urgency + pastDue) === 18) { 
        return 'task-box medium';
    } else if((priority + difficulty + urgency + pastDue) < 24 || (priority + difficulty + urgency + pastDue) === 24) { 
        return 'task-box high';
    } else {
        return 'task-box very-high';
    } 
    
  }

  getHeight(task) {
    return `${(task.difficulty + task.priority + task.urgency + task.pastDue)/1.5}em`;
  }
  getEM(task) {
    return (task.difficulty + task.priority + task.urgency + task.pastDue)/1.5;
  }

  importanceDifficultyFormat(format, number) {
      if(format === 'importance') {
        switch(number) {
          case 1:
          
            return `Not Important`;
          case 2:
          
            return `Low Priority`;
          case 3: 
        
            return `Important`;
          case 4:
      
            return `Very Important`;
          case 5:
    
            return `Critical`;
          default:
  
            return `Critical`;
        }
      } else if(format === 'difficulty') {
        switch(number) {
          case 1:
          
            return `Mindless`;
          case 2:
          
            return `Easy`;
          case 3:
        
            return `Average`;
          case 4:
      
            return `Involved`;
          case 5:
    
            return `Deep Focus`;
        }
      } else {
         
          switch(number) {
            case 1:
            
            return `Not Urgent`;
          case 2:
          
            return `Somewhat Urgent`;
          case 3:
        
            return `Urgent`;
          case 4:
      
            return `Very Urgent`;
          case 5:
    
            return `Get it Done Now!`;
          default:

            return 'Get It Done Now!';
          }
      }
    
  }

}
