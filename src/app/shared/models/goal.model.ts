import { Task } from './task.model';


export class Goal {
  title:string;
  deadline: string;
  priority:number;
  difficulty:number;
  urgency:number; 
  completed:number;
  completedDate:string;
  createdDate:string;
  tag:string;
  taskChildren: string[];
  id:string;
  parentGoal: string; //id
  show: boolean;

  constructor(
      title, 
      deadline,
      priority,
      difficulty,
      urgency,
      tag,
      children,
      id,
      parentGoal) {
        
    this.title = title;
    this.deadline = deadline;
    this.priority = priority;
    this.difficulty = difficulty;
    this.urgency = urgency;
    this.tag = tag;
    this.parentGoal = parentGoal;
    this.taskChildren = children !== null ? children.map(child => child.id) : null;
    this.id = id;
    this.completed = 0;
    this.show = true;

  }

} 