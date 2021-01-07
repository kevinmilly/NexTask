import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-date-time-entry',
  templateUrl: './date-time-entry.component.html',
  styleUrls: ['./date-time-entry.component.scss'],
})
export class DateTimeEntryComponent implements OnInit {

  dateControl:FormControl;
  bufferControl:FormControl;
  hideTime = false;
  stepHour = 1;
  stepMinute = 15;
  touchUi = true;
  minDate = moment().format("M/D/YYYY, H:MM:SS A");



  constructor(private modalController:ModalController) { }
 
  ngOnInit() {
      this.dateControl = new FormControl('', Validators.required);
      this.bufferControl = new FormControl('5', Validators.required);

      



  }

  submit() {
  
    this.modalController.dismiss({
      date:this.dateControl.value,
      buffer:this.bufferControl.value
    })
  }

  cancel() {
    this.modalController.dismiss({
      'dismissed':true
    })
  }

}
