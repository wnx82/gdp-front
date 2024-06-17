import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitationUsersComponent } from './habitation-users.component';

describe('HabitationUsersComponent', () => {
  let component: HabitationUsersComponent;
  let fixture: ComponentFixture<HabitationUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitationUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HabitationUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
