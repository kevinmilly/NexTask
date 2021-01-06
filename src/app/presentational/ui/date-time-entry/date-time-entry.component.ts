import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-date-time-entry',
  templateUrl: './date-time-entry.component.html',
  styleUrls: ['./date-time-entry.component.scss'],
})
export class DateTimeEntryComponent implements OnInit {

  timeForm:FormGroup;


  constructor(private modalController:ModalController) { }

  ngOnInit() {
    this.timeForm = new FormGroup({
      datetime: new FormControl('2021-01-01T07:43Z', Validators.required),
      // date: new FormControl('2021-01-01',Validators.required)
    })
  }

  submit() {
  
    this.modalController.dismiss({
      // time:this.timeForm.get('time').value,
      date:this.timeForm.get('datetime').value
    })
  }

  cancel() {
    this.modalController.dismiss({
      'dismissed':true
    })
  }

}
