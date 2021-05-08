import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';

import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { Metrics } from '../../../shared/models/metrics.model';
import { Badge } from '../../../shared/models/badge.model';
/*
  1:Completion
  2: TimeOfUse
  3:Tough
  4: Creation
*/

@Injectable({ 
  providedIn: 'root'
})
export class BadgeService { 

  badges:Badge[];
  awards: Badge[] = [];
  metrics:Metrics; 

  constructor(private firestore: AngularFirestore) { }


  getBadges(): Observable<Badge[]> {
   return  this.firestore.collection<Badge>(`Badge/`)
    .valueChanges()
  }

  checkCriteria(metrics) {
    console.log("reaching out for badges");
    this.getBadges().subscribe( badges => {
          this.badges = badges;
          console.log("Badges are: ");
          console.dir(this.badges);

          let toughBadges = [];
          let completionBadges = [];
          let timeBadges = []; 
          let creationBadges = [];
          let importantBadges = [];
          let urgencyBadges = [];
      
          if(metrics.toughTasks > 0) toughBadges = this.badges.filter(b => b.type === 3)
                                         .sort((a,b) => a.criteria - b.criteria);
          if(metrics.completions > 0) completionBadges = this.badges.filter(b => b.type === 1)
                                         .sort((a,b) => a.criteria - b.criteria);
          if(metrics.usageTime > 0) timeBadges = this.badges.filter(b => b.type === 2)
                                         .sort((a,b) => a.criteria - b.criteria);
          if(metrics.tasksCreated > 0) creationBadges = this.badges.filter(b => b.type === 4)
                                         .sort((a,b) => a.criteria - b.criteria);
          if(metrics.importantTasks > 0) importantBadges = this.badges.filter(b => b.type === 5)
                                         .sort((a,b) => a.criteria - b.criteria);
          if(metrics.urgencyTasks > 0) urgencyBadges = this.badges.filter(b => b.type === 6)
                                         .sort((a,b) => a.criteria - b.criteria);
      
          toughBadges.forEach(b => metrics.toughTask >= b.criteria && this.awards.push(b));
          completionBadges.forEach(b => metrics.completions >= b.criteria && this.awards.push(b));
          timeBadges.forEach(b => metrics.usageTime >= b.criteria && this.awards.push(b));
          creationBadges.forEach(b => metrics.taskCreated >= b.criteria && this.awards.push(b));
          importantBadges.forEach(b => metrics.importanTasks >= b.criteria && this.awards.push(b));
          urgencyBadges.forEach(b => metrics.urgencyTasks >= b.criteria && this.awards.push(b));
      
          return this.awards;
        
        });

  
     
  }


}
 