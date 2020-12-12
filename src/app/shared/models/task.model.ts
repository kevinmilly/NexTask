export class Task {
                    id:string;
                    day:number;
                    description?:string;
                    minutes:number;
                    priority:number;
                    difficulty:number;
                    urgency:number;
                    pastDue?:number;
                    resource:string;
                    title:string;
                    completed = 0;
                    completedDate:string;
                    createdDate:string;
                    tag:string;
                    goalId:string;
                    milestoneTitle?:string;
                    parentGoalTitle?:string 
                    show: boolean;

    constructor(
        id, 
        title,  
        description,
        minutes, 
        priority,
        difficulty,
        urgency,
        tag,
        parentGoal,
        createdDate,
        milestoneTitle,
        parentGoalTitle) {
                        this.minutes = minutes;
                        this.id = id;
                        this.title = title;
                        this.description = description;
                        this.priority = priority;
                        this.difficulty = difficulty;
                        this.urgency = urgency;
                        this.tag = tag;
                        this.goalId = parentGoal;
                        this.createdDate = createdDate; 
                        this.milestoneTitle = milestoneTitle;
                        this.parentGoalTitle = parentGoalTitle;
                        this.pastDue = 0;
                        this.show = true;
    }
}