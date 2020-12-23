import { Goal } from '../models/goal.model';

export const testGoals: Goal[] = [
    {
        title:'Test Goal 1',
        deadline: '2020-12-24',
        priority: 3,
        difficulty:4,
        urgency:2, 
        completed: 0,
        completedDate: '',
        createdDate: '2020-11-21',
        tag: 'general',
        taskChildren: [],
        id:'dfgerbdgg',
        parentGoal:null,
        show: true
    },
    {
        title:'Test Milestone 1',
        deadline: '2020-12-01',
        priority: 3,
        difficulty:4,
        urgency:2, 
        completed: 0,
        completedDate: '',
        createdDate: '2020-11-28',
        tag: 'general',
        taskChildren: ['slkejl34kjl3k'],
        id:'1a2b3c',
        parentGoal:'dfgerbdgg',
        show: true
    },
    {
        title:'Test Milestone 2',
        deadline: '2020-12-24',
        priority: 3,
        difficulty:4,
        urgency:2, 
        completed: 0,
        completedDate: '',
        createdDate: '2020-11-21',
        tag: 'general',
        taskChildren: ['dgdgdsae','dsfdgdgdsae'],
        id:'a1b2c3',
        parentGoal:'dfgerbdgg',
        show: true
    },
];