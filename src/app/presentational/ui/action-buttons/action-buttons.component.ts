import { Component, OnInit } from '@angular/core';
import { TaskManagementService } from 'src/app/shared/services/task-management.service';


@Component({
  selector: 'action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent implements OnInit {

  constructor(
     private tmService: TaskManagementService
  ) { }

  ngOnInit() {}


  addTask() {this.tmService.addTask();}

  addGoal() { this.tmService.addGoal();}

  openSettings() {this.tmService.openSettings();}

  showAwards() {this.tmService.showAwards();}


}
 