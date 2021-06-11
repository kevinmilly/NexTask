import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeTranslate'
})
export class TimeTranslatePipe implements PipeTransform {

  transform(minutes:number) {
        if(minutes > 60)
            return `${Math.floor(minutes / 60)}:${minutes % 60} hrs.`;
        else 
            return `${minutes} min.`
    
  }

}
