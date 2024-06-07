import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConstatComponent } from './create-constat.component';

describe('CreateConstatComponent', () => {
  let component: CreateConstatComponent;
  let fixture: ComponentFixture<CreateConstatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateConstatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateConstatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
