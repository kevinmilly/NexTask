import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/shared/models/task.model';

@Pipe({
  name: 'hoursSum'
})
export class HoursSumPipe implements PipeTransform {

  transform(tasks:Task[]) {
    const totalTimeInMin = tasks.reduce((acc,curr) => acc + curr.minutes, 0);
        return `${Math.floor(totalTimeInMin / 60)}:${totalTimeInMin % 60} hours`;
    
  }

}
