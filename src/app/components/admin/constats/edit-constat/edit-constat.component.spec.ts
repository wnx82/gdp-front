import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConstatComponent } from './edit-constat.component';

describe('EditConstatComponent', () => {
  let component: EditConstatComponent;
  let fixture: ComponentFixture<EditConstatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConstatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditConstatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
