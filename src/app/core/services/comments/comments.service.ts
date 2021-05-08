
import { Injectable } from "@angular/core";




@Injectable({providedIn: 'root'})
export class CommentsService {

    private encouragements = [
        "Excellent Job!",
        "You're rocking and rolling!",
        "You will be legendary!",
        "How do you do it!",
        "You're a beast!",
        "You are incredible!",
        "You ain't even playing around!",
        "Ridiculous!",
        "Keep up the good work!",
        "Hang in there, you're almost done!",
        "Keep going like this you'll conquer the world!"
    ];


    get encouragement() {
        return this.encouragements;
    }
}