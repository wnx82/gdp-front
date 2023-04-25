import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuesLocalStorageComponent } from './rues-local-storage.component';

describe('RuesLocalStorageComponent', () => {
  let component: RuesLocalStorageComponent;
  let fixture: ComponentFixture<RuesLocalStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuesLocalStorageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuesLocalStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
