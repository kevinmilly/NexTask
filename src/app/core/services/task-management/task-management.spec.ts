import { TestBed } from '@angular/core/testing';

import { testTasks } from '../../../shared/test-data/test-tasks';
import { testGoals } from '../../../shared/test-data/test-goals';
import { TaskManagementService } from './task-management.service';
import * as moment from "moment";
import { Goal } from 'src/app/shared/models/goal.model';
import { Task } from 'src/app/shared/models/task.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { BackendService } from '../backend/backend.service';
import { AuthRedoneService } from '../auth/authredone.service';
import { ModalController } from '@ionic/angular';

describe('TaskManagementService', () => {

  let tmService: TaskManagementService;
//   let fakeFireService = jasmine.createSpyObj("fakeFire",[]);

  let goals:Goal[];
  let tasks:Task[];
  let backend: any;
  let auth: any;
  let modal: any;
  

  backend = jasmine.createSpyObj("backend",[
    'getTasks', 
    'addMetric',
    'getGoals',
    'getDayHours',
    'updateGoals',
    'updateTasks'
  ])

  auth = jasmine.createSpyObj("auth",["loggedIn"]);
  modal = jasmine.createSpyObj("modal", ["presentModal"]);


  beforeEach(() => {
    goals = [];
    tasks = [];
    goals = [...testGoals];
    tasks = [...testTasks];
    TestBed.configureTestingModule({
      providers:[
        {provide:BackendService, useValue:backend},
        {provide:ModalController, useValue:modal},
        {provide:AuthRedoneService, useValue:auth},
         TaskManagementService
        ] 
    });
    tmService = TestBed.inject(TaskManagementService);
  });


  it('should calculate how many days a task is past due from completion', () => {
    tasks[0].pastDue = 0;
    tasks[0].createdDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const pastDueCalculated = tmService.calculatePastDue([tasks[0]]);
    expect(pastDueCalculated[0].pastDue).toBe(1);

  });

  it('should prioritize goal related Tasks', () => {
    const goalRelatedTasks = tasks.filter(t => t.goalId);
    goalRelatedTasks[goalRelatedTasks.length-1].priority = 5;
    goalRelatedTasks[goalRelatedTasks.length-1].difficulty = 5;
    goalRelatedTasks[goalRelatedTasks.length-1].urgency = 5;

    const prioritizedTasks = tmService.goalRelatedTaskPrioritize(goalRelatedTasks, goals);
    expect(prioritizedTasks[0].id).toEqual("slkejl34kjl3k");

  });

  it(`should sort non-goal tasks and goal related tasks a like, 
        and combine them into one; both having been not completed of course`, () => {

    tasks[0].priority = 5;
    tasks[0].difficulty = 5;
    tasks[0].urgency = 5;
    const shouldBeHighest = tasks[0];
    const[t,g] = tmService.prioritizeAdhocAndGoalRelatedTasks(tasks,goals);

    expect(t[0].id).toEqual(shouldBeHighest.id);
  
  });

  it(`should separate tasks per day based on the minutes per day allowed`, () => {
       const hours = 4;
       tasks[0].minutes = 120;
       tasks[1].minutes = 120;
       tasks[2].minutes = 120;

       const list = tmService.incrementDaysForTasks(
           hours,
           [tasks[0],tasks[1], tasks[2]]
       );

       expect(list[list.length-1].day).toEqual(2);
  });


  it('should check if a milestone is done (all the tasks are complete)', () => {
      tasks[0].completed = 1;
      expect(tmService.checkIfMilestoneDone(goals[1].id,tasks,goals))
        .toBe(1);
  });


  //test for goal done





});
 