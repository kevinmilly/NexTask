import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Badge } from 'src/app/shared/models/badge.model';
import { Metrics } from 'src/app/shared/models/metrics.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { BadgeService } from 'src/app/shared/services/badge.service';


interface BadgeStatus {
  title: string;
  image: string;
  criteriaProgress: number;
  status: string;

}

@Component({
  selector: 'app-show-award',
  templateUrl: './show-award.component.html',
  styleUrls: ['./show-award.component.scss']
})
export class ShowAwardComponent implements OnInit {

  constructor(private dialog:MatDialog, 
              private badgeService: BadgeService,
              private auth: AuthService) { }

  metrics: Metrics;
  badges: Badge[];
  badgeSub: Subscription;

  badgesOwned = [];
  badgeStatus:BadgeStatus[] = []; 
  noBadges = false;
  

  ngOnInit(): void {
    this.badgeSub = this.badgeService.getBadges()
                      .subscribe(badges => {
                        this.badges = badges;
                        this.metrics = this.auth.metrics;

                        console.dir(this.badges);
                        console.dir(this.metrics);

                        this.badges
                          .forEach(b => {
                            if(this.metrics.awards.includes(b.title)) {
                              this.badgesOwned.push(b);
                              this.badgeStatus.push({
                                title: b.title,
                                image: `../../../../assets/badges${b.title}.svg`,
                                criteriaProgress: this.getCriteriaStatus(b,this.metrics),
                                status
                              })
                            } else {
                              this.noBadges = true;
                            }
                          }) 
                       
                    });
  }

  getCriteriaStatus(badge:Badge, metrics:Metrics) {
    switch (badge.type) {
      case 1:
        return badge.criteria - metrics.completions;
      case 2:
        return badge.criteria - metrics.usageTime;
      case 3:
        return badge.criteria - metrics.toughTasks;
      case 4:
        return badge.criteria - metrics.tasksCreated;
    
    }
  }

  ngOnDestroy() {
    if(this.badgeSub) {
      this.badgeSub.unsubscribe();
    }
  }

  




}
