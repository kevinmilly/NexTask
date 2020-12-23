import { Component, OnInit } from '@angular/core';
import { TaskManagementService } from 'src/app/shared/services/task-management.service';


@Component({
  selector: 'action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent implements OnInit {

  buttonSettings = false;

  constructor(
     private tmService: TaskManagementService
  ) { }

  ngOnInit() {}


  addTask() {this.tmService.addTask();}

  addGoal() { this.tmService.addGoal();}



  showAwards() {this.tmService.showAwards();}


}
 