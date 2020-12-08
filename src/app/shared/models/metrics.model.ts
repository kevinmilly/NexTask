

export class Metrics {
  id:string;
  toughTasks:number;
  tasksCreated:number;
  completions:number;
  importantTasks:number;
  urgencyTasks:number;
  usageTime:number;
  awards: string[] = [];

  /**
   *
   */
  constructor(tough, created, completed, important, urgency, time) {
    this.toughTasks = tough;
    this.tasksCreated = created;
    this.completions = completed
    this.importantTasks = important;
    this.urgencyTasks = urgency;
    this.usageTime = time;
  }

} 