import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstatsStatsComponent } from './constats-stats.component';

describe('ConstatsStatsComponent', () => {
  let component: ConstatsStatsComponent;
  let fixture: ComponentFixture<ConstatsStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstatsStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConstatsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
