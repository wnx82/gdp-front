import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDailiesComponent } from './create-dailies.component';

describe('CreateDailiesComponent', () => {
  let component: CreateDailiesComponent;
  let fixture: ComponentFixture<CreateDailiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDailiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDailiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
