import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdRapportComponent } from './id-rapport.component';

describe('IdRapportComponent', () => {
  let component: IdRapportComponent;
  let fixture: ComponentFixture<IdRapportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdRapportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
