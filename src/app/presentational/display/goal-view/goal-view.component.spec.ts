import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { GoalViewComponent } from './goal-view.component';

describe('GoalViewComponent', () => {
  let component: GoalViewComponent;
  let fixture: ComponentFixture<GoalViewComponent>;
  let backend:any;

  beforeEach(async(() => {
    backend = jasmine.createSpyObj("backend",[get])
    TestBed.configureTestingModule({
      declarations: [ GoalViewComponent ],
      imports: [IonicModule.forRoot()],
      providers:[]
    }).compileComponents();

    fixture = TestBed.createComponent(GoalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all goals', () => {
    expect(fixture.nativeElement.querySelectorAll('.goal-item').length).toBe(2);
  })

  it('should show nested milestones', () => {
    const milestones = fixture.nativeElement.querySelectorAll(".goal-item .milestone-item");
    console.dir(milestones[0]);

  })
});
