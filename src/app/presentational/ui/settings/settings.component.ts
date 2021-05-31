import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  @Input() settings: any;
  settingsForm:FormGroup;

  constructor(public modalController: ModalController) { }

  ngOnInit() { 
    console.dir(this.settings[0].hours);
    this.settingsForm = new FormGroup({
      hours: new FormControl(this.settings[0].hours, [Validators.required,Validators.max(24), Validators.min(1)])
    })
  }

  ngAfterViewInit() {
   

  }

  submitSettings() {
    this.settings[0].hours = this.settingsForm.get('hours').value;
        this.modalController.dismiss(this.settings[0]);
  }

  get hours():number {return this.settingsForm.get('hours').value}

  cancel() {
    this.modalController.dismiss({
      'dismissed': true
    })
  }

}
