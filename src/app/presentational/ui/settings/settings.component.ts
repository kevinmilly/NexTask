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

  @Input() hourSettings: any;
  settingsForm:FormGroup;

  constructor(public modalController: ModalController) { }

  ngOnInit() { 
    console.dir(this.hourSettings);
    this.settingsForm = new FormGroup({
      hours: new FormControl(this.hourSettings, [Validators.required,Validators.max(24), Validators.min(1)])
    })
  }

  ngAfterViewInit() {
   

  }

  submitSettings() {
    this.hourSettings = this.settingsForm.get('hours').value;
        this.modalController.dismiss(this.hourSettings);
  }

  get hours(){return this.settingsForm.get('hours')}

  cancel() {
    this.modalController.dismiss({
      'dismissed': true
    })
  }

}
