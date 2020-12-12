import { Goal } from '../models/goal.model';

export const goals: Goal[] = [
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
        parentGoal:'',
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
        taskChildren: ['1a2b3c'],
        id:'fvsddsd',
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
        taskChildren: ['a1b2c3','aa11bb22'],
        id:'njkjlfgh',
        parentGoal:'dfgerbdgg',
        show: true
    },
];