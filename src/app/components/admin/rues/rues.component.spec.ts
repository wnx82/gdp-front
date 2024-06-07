import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuesComponent } from './rues.component';

describe('RuesComponent', () => {
  let component: RuesComponent;
  let fixture: ComponentFixture<RuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
