import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WelcomeSliderPage } from './welcome-slider.page';

describe('WelcomeSliderPage', () => {
  let component: WelcomeSliderPage;
  let fixture: ComponentFixture<WelcomeSliderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeSliderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeSliderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
