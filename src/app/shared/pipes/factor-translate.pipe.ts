import { Pipe, PipeTransform } from '@angular/core';
import { Importance, Difficulty, Urgency } from 'src/app/containers/models/factors.enum';



@Pipe({
    name: 'factorTranslate'
})
export class FactorTranslatePipe implements PipeTransform {



    transform(value: number, factor: string) {
        if (factor === 'importance') {
            return Importance[value];
        } else if (factor === 'difficulty') {
            return Difficulty[value];
        } else {
            return Urgency[value];
        }

    }

}
