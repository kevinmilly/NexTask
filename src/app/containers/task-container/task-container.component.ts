import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { ModalController, ToastController } from '@ionic/angular';
import { CommentsService } from 'src/app/core/services/comments/comments.service';



@Component({
  selector: 'app-task-container',
  templateUrl: './task-container.component.html',
  styleUrls: ['./task-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskContainerComponent implements OnInit {

  @Input() tasks: Task[] = [];
  @Input() deviceSize: string = '';

  @Output() markedComplete: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() taskUpdate = new EventEmitter();
  @Output() editTaskEmitter: EventEmitter<Task> = new EventEmitter<any>();
  @Output() deleteTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() createdIdea: EventEmitter<Task> = new EventEmitter<Task>();

  panelOpenState: boolean = false;
  toolTipOptions = {
    'placement': 'left',
    'hide-delay': -300
  }

  quotes;

  constructor(
    public modalController: ModalController,
    private commentService: CommentsService,
    public toastController: ToastController
  ) { }

  ngOnInit(): void {
    this.quotes = this.commentService.encouragement;
  }

  markComplete(task: Task) {
    this.getRandomQuote();
    this.markedComplete.emit(task);
  }

  delete(task: Task) {
    if (confirm("Do you really wanna delete this?")) {
      this.getRandomQuote();
      this.deleteTask.emit(task);
    }

  }

  editTask(event) {
    this.editTaskEmitter.emit(event);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
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



  getRandomQuote() {
    this.presentToast(this.quotes[Math.floor(Math.random() * (this.quotes.length))]);
  }


}
