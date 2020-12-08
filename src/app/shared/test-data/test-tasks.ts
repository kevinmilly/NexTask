import { Task } from '../models/task.model';

export const tasks:Task[] = [
    {
        id:'slkejl34kjl3k',
        day: 1,
        description: "Test Description 1",
        minutes: 33,
        priority: 3,
        difficulty: 5,
        urgency: 2,
        pastDue: 1,
        resource: '',
        title: 'Test Task 1',
        completed:0,
        completedDate: '',
        createdDate: '2020-11-28',
        tag: 'general',
        goalId: '1a2b3c',
        milestoneTitle: 'Test Milestone 1',
        parentGoalTitle: 'Test Goal 1'
    },
    {
        id:'dgdgdsae',
        day: 1,
        description: "Test Description 2",
        minutes: 23,
        priority: 5,
        difficulty: 5,
        urgency: 2,
        pastDue: 1,
        resource: '',
        title: 'Test Task 2',
        completed:0,
        completedDate: '',
        createdDate: '2020-11-28',
        tag: 'general',
        goalId: 'a1b2c3',
        milestoneTitle: 'Test Milestone 2',
        parentGoalTitle: 'Test Goal 1'
    },
    {
        id:'sdnhfgrt',
        day: 1,
        description: "Test Description 3",
        minutes: 13,
        priority: 3,
        difficulty: 1,
        urgency: 3,
        pastDue: 1,
        resource: '',
        title: 'Test Task 3',
        completed:0,
        completedDate: '',
        createdDate: '2020-11-28',
        tag: 'general',
        goalId: '',
        milestoneTitle: '',
        parentGoalTitle: ''
    },
    {
        id:'mvghfghf',
        day: 1,
        description: "Test Description 4",
        minutes: 13,
        priority: 3,
        difficulty: 1,
        urgency: 3,
        pastDue: 1,
        resource: '',
        title: 'Test Task 4',
        completed: 1,
        completedDate: '2020-11-22',
        createdDate: '2020-11-28',
        tag: 'general',
        goalId: '',
        milestoneTitle: '',
        parentGoalTitle: ''
    },
    {
        id:'dsfdgdgdsae',
        day: 1,
        description: "Test Description 5",
        minutes: 23,
        priority: 5,
        difficulty: 5,
        urgency: 2,
        pastDue: 1,
        resource: '',
        title: 'Test Task 5',
        completed:1,
        completedDate: '2020-11-22',
        createdDate: '2020-11-22',
        tag: 'general',
        goalId: 'aa11bb22',
        milestoneTitle: 'Test Milestone 2',
        parentGoalTitle: 'Test Goal 1'
    },
]