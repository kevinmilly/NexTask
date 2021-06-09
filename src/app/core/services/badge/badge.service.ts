import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { Metrics } from '../../../shared/models/metrics.model';
import { Badge } from '../../../shared/models/badge.model';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';

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

  badges: Badge[];
  badgeAwards: Badge[] = [];
  metrics: Metrics;

  toughBadges = [];
  completionBadges = [];
  timeBadges = [];
  creationBadges = [];
  importantBadges = [];
  urgencyBadges = [];

  awardsSub:Subscription;

  constructor(private firestore: AngularFirestore) {

   }


  getBadges(): Observable<Badge[]> {
    return this.firestore.collection<Badge>(`Badge/`)
      .valueChanges()
  }
 //TODO: Need to complete gamification function
  // determineAwards(metrics) : Observable<BadgeService[]> {

  //   return this.getBadges()
  //   .pipe(take(1))
  //   .subscribe(badges => {
  //     this.badges = badges;

  //     const [tough,completions,usage,tasks,importance,urgency] = this.setupCriteria(metrics);
      
  //     this.badgeAwards = this.checkCriteria(metrics,tough,completions,usage,tasks,importance,urgency);


  //   });

  // }

  setupCriteria(metrics) {
    const badgeResults = [];
    if (metrics.toughTasks > 0) badgeResults.push(this.badges.filter(b => b.type === 3)
        .sort((a, b) => a.criteria - b.criteria));
      if (metrics.completions > 0)  badgeResults.push(this.badges.filter(b => b.type === 1)
        .sort((a, b) => a.criteria - b.criteria));
      if (metrics.usageTime > 0)  badgeResults.push(this.badges.filter(b => b.type === 2)
        .sort((a, b) => a.criteria - b.criteria));
      if (metrics.tasksCreated > 0)  badgeResults.push(this.badges.filter(b => b.type === 4)
        .sort((a, b) => a.criteria - b.criteria));
      if (metrics.importantTasks > 0)  badgeResults.push(this.badges.filter(b => b.type === 5)
        .sort((a, b) => a.criteria - b.criteria));
      if (metrics.urgencyTasks > 0)  badgeResults.push(this.badges.filter(b => b.type === 6)
        .sort((a, b) => a.criteria - b.criteria));

        return badgeResults;
  }

  checkCriteria(metrics,tough,completions,usage,tasks,importance,urgency): Badge[] {
      const badges = [];
      tough.forEach(b => metrics.toughTask >= b.criteria && badges.push(b));
      completions.forEach(b => metrics.completions >= b.criteria && badges.push(b));
      usage.forEach(b => metrics.usageTime >= b.criteria && badges.push(b));
      tasks.forEach(b => metrics.taskCreated >= b.criteria && badges.push(b));
      importance.forEach(b => metrics.importanTasks >= b.criteria && badges.push(b));
      urgency.forEach(b => metrics.urgencyTasks >= b.criteria && badges.push(b));

      return this.badges;
  }



}
