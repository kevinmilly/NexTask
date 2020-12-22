import { TestBed } from '@angular/core/testing';

import { BackendService } from './backend.service';

import { BadgeService } from './badge.service';

import { testBadges } from '../test-data/test-badge';
import { testMetrics } from '../test-data/test-metrics';
import { testTasks } from '../test-data/test-tasks';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

xdescribe('BackendService', () => {
  let service: BackendService;

  let fakeFireService = jasmine.createSpyObj("fakeFire",["collection"]);
  let authService = jasmine.createSpyObj("auth",["metrics"]);
  
  let badges = testBadges;
  let metrics = testMetrics;
  let tasks = testTasks;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        {provide:AngularFirestore, useValue:fakeFireService},
        {provide: AuthService, useValue: authService}
      ]
    });
    service = TestBed.inject(BackendService);
    authService = TestBed.inject(BackendService);
    fakeFireService = TestBed.inject(BackendService);

   
    

    spyOn(service, "updateMetric");
 

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should award a toughBadge award if toughBadge is earned', () => {
    expect(
      service.addMetric(tasks[0],"completion")
        .find(a => a.title === 'Warrior Will')).toBeTruthy();

  })

  it('should award a taskCreated award if taskCreated is earned', () => {
    expect(
      service.addMetric(tasks[0],"creation")
        .find(a => a.title === 'Create and Conquer')).toBeTruthy();

  })

  it('should award a usage award if usage is earned', () => {
    expect(
      service.addMetric(tasks[0],"completion")
        .find(a => a.title === 'Professional Tasker')).toBeTruthy();

  })


});
 