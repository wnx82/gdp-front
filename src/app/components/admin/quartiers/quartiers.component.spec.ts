import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartiersComponent } from './quartiers.component';

describe('QuartiersComponent', () => {
  let component: QuartiersComponent;
  let fixture: ComponentFixture<QuartiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuartiersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuartiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
