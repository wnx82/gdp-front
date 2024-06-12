import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInfractionComponent } from './edit-infraction.component';

describe('EditInfractionComponent', () => {
  let component: EditInfractionComponent;
  let fixture: ComponentFixture<EditInfractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditInfractionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditInfractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
