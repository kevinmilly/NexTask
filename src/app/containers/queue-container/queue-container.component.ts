import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { LoadingController, ToastController } from '@ionic/angular';

import { Task } from '../../shared/models/task.model';

import { TaskManagementService } from 'src/app/core/services/task-management/task-management.service';
import { CommentsService } from 'src/app/core/services/comments/comments.service';
import { AuthService } from '../../core/services/auth/auth.service';


@Component({
  selector: 'queue-container',
  templateUrl: './queue-container.component.html',
  styleUrls: ['./queue-container.component.scss'],
})
export class QueueContainerComponent implements OnInit {

  taskSub: Subscription;
  goalsSub: Subscription;
  daySub: Subscription;

  tasksDay1$: Observable<Task[]>;
  tasksDay2$: Observable<Task[]>;
  tasksDay3$: Observable<Task[]>;
  tasksDay4$: Observable<Task[]>;
  tasksDay5$: Observable<Task[]>;

  tags = ['general', 'All'];
  tagsSaved = ['general', 'All'];
  tagOptions = new FormControl('All', []);

  quotes;
  userInfo;



  constructor(
    private tmService: TaskManagementService,
    public toastController: ToastController,
    private commentsService: CommentsService,
    private auth: AuthService,
    private loadingController: LoadingController,
  ) { }


  ngOnInit(): void {

    this.tmService.init();
    this.tags = this.tmService.filterTags;
    this.presentLoading(4, "Looking for goals and tasks");
    this.quotes = this.commentsService.encouragement;
    this.userInfo = this.auth.user;

  }

  ngAfterViewInit() { this.filterTasks(); }

  createEvents(tasks) {
    this.tmService.createEvent(tasks);
  }


  filterTasks() {

    if (this.tagOptions.value === 'All') {
      this.tasksDay1$ = this.tmService.tasks$.pipe(map((tasks: any) => tasks[0].filter(t => t.day === 1)));
      this.tasksDay2$ = this.tmService.tasks$.pipe(map((tasks: any) => tasks[0].filter(t => t.day === 2)));
      this.tasksDay3$ = this.tmService.tasks$.pipe(map((tasks: any) => tasks[0].filter(t => t.day === 3)));
      this.tasksDay4$ = this.tmService.tasks$.pipe(map((tasks: any) => tasks[0].filter(t => t.day === 4)));
      this.tasksDay5$ = this.tmService.tasks$.pipe(map((tasks: any) => tasks[0].filter(t => t.day === 5)));
      return;
    }
    const tempTasks = this.tmService.tasks$.pipe(
      map((tasks: any) => tasks[0].filter(t => this.tagOptions.value.includes(t.tag)))
    );
    this.tasksDay1$ = tempTasks.pipe(map((tasks: any) => tasks.filter(t => t.day === 1)));
    this.tasksDay2$ = tempTasks.pipe(map((tasks: any) => tasks.filter(t => t.day === 2)));
    this.tasksDay3$ = tempTasks.pipe(map((tasks: any) => tasks.filter(t => t.day === 3)));
    this.tasksDay4$ = tempTasks.pipe(map((tasks: any) => tasks.filter(t => t.day === 4)));
    this.tasksDay5$ = tempTasks.pipe(map((tasks: any) => tasks.filter(t => t.day === 5)));
  }

  addInitialTask() {
    this.tmService.addInitialTask();
    this.getRandomQuote();
  }

  addTask() {
    this.tmService.addTask();
    this.presentLoading(1, "Reloading");
  }

  editTask(event) {
    const returnItem = this.tmService.editItem(event, 'task');

  }

  updateAllTasks(event) {
    this.tmService.updateAllTasks(event);
  }

  deleteTask(event) {
    this.tmService.deleteTask(event);
  }

  markTaskComplete(event) {

    this.tmService.markTaskComplete(event);
    this.getRandomQuote();
  }

  updateSettings() {
    this.tmService.updateSettings();

  }


  addGoal() {
    this.presentLoading(1, "Reloading");
    this.tmService.addGoal();
  }

  getRandomQuote() {
    this.presentToast(this.quotes[Math.floor(Math.random() * (this.quotes.length))]);
  }



  async presentToast(message) {
    const toast = await this.toastController.create({
      message: `Hey ${this.userInfo.displayName}! ${message}`,
      duration: 2000
    });
    toast.present();
  }

  async presentTwoPartToast(main, sub) {
    const toast = await this.toastController.create({
      header: main,
      message: sub,
      duration: 2000
    });
    toast.present();
  }

  async presentLoading(d, m) {
    const loading = await this.loadingController.create({
      message: m,
      duration: d
    });
    await loading.present();

    const { data } = await loading.onDidDismiss();


  }



}