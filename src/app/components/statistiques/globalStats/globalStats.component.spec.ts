import { ComponentFixture, TestBed } from '@angular/core/testing';

import { globalStats } from './globalStats.component';

describe('globalStats', () => {
  let component: globalStats;
  let fixture: ComponentFixture<globalStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ globalStats ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(globalStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
