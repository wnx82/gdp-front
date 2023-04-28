import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitationsComponent } from './habitations.component';

describe('HabitationsComponent', () => {
  let component: HabitationsComponent;
  let fixture: ComponentFixture<HabitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HabitationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
