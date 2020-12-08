import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../shared/services/backend.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styles: [
  ]
})
export class SettingsComponent implements OnInit {
  daySub: Subscription;
  defaultHours = 0;

  constructor(
    private backend: BackendService,
    public dialogRef: MatDialogRef<SettingsComponent>
    ) { }

  ngOnInit(): void {
    this.daySub = this.backend.getDayHours()
    .subscribe(h => {
      console.dir(h);
      this.defaultHours = h;
      console.log(`The default hours are ${this.defaultHours}`);
  


    })
  }

  updateHours(hours) {
    this.dialogRef.close({
      hours: hours || this.defaultHours
    })
  }

  ngOnDestroy() {
    if(this.daySub) this.daySub.unsubscribe();
  }

}
