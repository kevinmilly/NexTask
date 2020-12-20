import { DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { Goal } from '../models/goal.model';
import { Task } from '../models/task.model';
import { testGoals } from '../test-data/test-goals';
import { testTasks } from '../test-data/test-tasks';
import { AuthService } from './auth.service';
import { BackendService } from './backend.service';



import { TaskManagementService } from './task-management.service';

fdescribe('TaskManagementService', () => {
  let tmService: TaskManagementService;
  let backend: any;
  let auth: any;
  let modal: any;

  let goals:Goal[];
  let tasks:Task[];

  let unsub;


  backend = jasmine.createSpyObj("backend",['getTasks','getGoals','getDayHours'])
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

    goals = testGoals;
    tasks = testTasks;



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

      console.log({result});

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

    tmService.tasksDay1$
      .subscribe( ts => {
        t = ts;

      })

    
    unsub = tmService.sortDays(5,tasks);

     expect(t[0].day).toBe(1);
   
  })

  afterEach(() => {

    tmService = null
    backend = null

    goals = [];
    tasks = [];

    if(unsub) unsub.unsubscribe();

  });

   
});
