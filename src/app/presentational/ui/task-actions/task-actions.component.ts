import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


import * as moment from 'moment';

@Component({
  selector: 'app-task-actions',
  templateUrl: './task-actions.component.html',
  styleUrls: ['./task-actions.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TaskActionsComponent implements OnInit {

  value: number = 0.5;
  
  @Output() dayHoursEmitter: EventEmitter <number> = new EventEmitter<number>();


  @Input() dayHours;

  hours = [1,2,3,4,5,6,7,8];

  hoursPerDay: number;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    const today = new Date().setHours(8)
    console.dir(moment(today));

    this.hoursPerDay = this.dayHours;



  }

  // addTask() {
  //   const dialogRef = this.dialog.open(TaskEntryComponent, {
  //     width: '450px',
  //     // data: {name: this.name, animal: this.animal}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.dir(result);
  //     this.addTaskEmitter.emit(result);
  //   });
  // }

  changeHours() {
    this.dayHoursEmitter.emit(this.hoursPerDay);
  }

 

}
