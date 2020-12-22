import { DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { Goal } from '../models/goal.model';
import { Task } from '../models/task.model';
import { testGoals } from '../test-data/test-goals';
import { testTasks } from '../test-data/test-tasks';
import { AuthService } from './auth.service';
import { BackendService } from './backend.service';
import * as moment from "moment";


import { TaskManagementService } from './task-management.service';
import { BehaviorSubject } from 'rxjs';

fdescribe('TaskManagementService', () => {
  let tmService: TaskManagementService;
  let backend: any;
  let auth: any;
  let modal: any;

  let goals:Goal[];
  let tasks:Task[];

  let unsub;




  backend = jasmine.createSpyObj("backend",[
    'getTasks', 
    'addMetric',
    'getGoals',
    'getDayHours',
    'updateGoals',
    'updateTasks'
  ])
  auth = jasmine.createSpyObj("auth", ["loggedIn"]);
  modal = jasmine.createSpyObj("modal", ["presentModal"]);
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskManagementService,
        {provide:BackendService, useValue:backend},
        {provide:AuthService, useValue:auth},
        {provide:ModalController, useValue:modal},
      ]
    });
    tmService = TestBed.inject(TaskManagementService);
    backend = TestBed.inject(BackendService);

 
    goals = [];
    tasks = [];
    goals = [...testGoals];
    tasks = [...testTasks];



  });

  it('should be created', () => {
    expect(tmService).toBeTruthy();
  });

  xit('should add the correct pastDue properties on all the tasks', ()=> {

    const result = tmService.calculatePastDue(tasks);

    result.forEach(r => expect(r.pastDue).toBeTruthy);

    expect(result[0].pastDue).toBe(
      tmService.dateDifference(new Date(), new Date(result[0].createdDate))
    );

  })

  it('should sort non-completed tasks taking into account urgency, difficulty, priority, and how long it has existed', () => {
      const result = tmService.fullySortNonCompletedTasks(tasks);

      result.forEach(r => expect(!r.complete).toBeTruthy);
      if(result.length > 2) {
        expect(
          result[0].urgency + 
          result[0].priority + 
          result[0].difficulty +
          result[0].pastDue
          )
          .toBeGreaterThan(
            result[1].urgency + 
            result[1].priority + 
            result[1].difficulty +
            result[1].pastDue
          )
      }

      
  })

  it('should allocate tasks to up to 5 days based on the amount time a person wants to work', () => {
    
   let t;

   unsub =  tmService.tasksDay1$
      .subscribe( ts => {
        t = ts;

      })
 
    
     tmService.sortDays(5,tasks); 

     expect(t[0].day).toBe(1);
   
  })

  it('should mark the task complete', () => {
    expect(tasks[0]).toBeTruthy();
    
    tmService.markTaskComplete(tasks[0],[...tasks]);

    expect(tasks[0].completed).toBeTruthy();
    expect(tasks[0].completedDate).toBe(moment().format('YYYY-MM-DD'));
  })


  it('should not handle goalUpdates if there is no associated Milestone for the task', () => {
    expect(!goals.find(g => tasks[2].goalId === g.id)).toBeTruthy();

  })

  it('should handle in goalUpdates if necessary', () => {

    tasks[0].completed = 1;
    const index = tasks.findIndex(t => t.id === tasks[0].id);

    const associatedMilestone = goals.find(g => tasks[index].goalId === g.id);
    const associatedGoal = goals.find(g => g.id === associatedMilestone.parentGoal);
    goals[0].completed = 0;

    tmService.handleGoalUpdates(index, tasks, goals);

    
    expect(associatedMilestone.completed).toBeTruthy();
    expect(!associatedGoal.completed).toBeTruthy();
    console.dir(associatedGoal);

  })

  it('should mark parent goal complete if all the milestones are complete', () => {
    
    tasks[1].completed = 1;
    tasks[4].completed = 1;
    goals[1].completed = 1;
  
    tmService.handleGoalUpdates(4, tasks, goals);

    expect(goals[0].completed).toBeTruthy();

    goals[1].completed = 0;
    tmService.handleGoalUpdates(4, tasks, goals);

    expect(!goals[0].completed).toBeTruthy();
  // expect(goals[0].completedDate).toBe()
    
    
  })

  it('should return whether a milestone is complete', () => {
    tasks[0].completed = 1;

    expect(
      tmService.checkIfMilestoneDone(tasks[0].goalId, tasks, goals)
    ).toBeTruthy();
  })

  it('should return whether a goal is complete', () => {
    goals[1].completed = 1;
    goals[2].completed = 1;
    expect(
      tmService.checkIfGoalDone(goals[1].parentGoal, goals)
    ).toBeTruthy();
  })

  afterEach(() => {

    goals = [];
    tasks = [];

    if(unsub) unsub.unsubscribe();

  });

      
  
    
    
  });

   

