import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdDailieComponent } from './id-dailie.component';

describe('IdDailieComponent', () => {
  let component: IdDailieComponent;
  let fixture: ComponentFixture<IdDailieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdDailieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdDailieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
