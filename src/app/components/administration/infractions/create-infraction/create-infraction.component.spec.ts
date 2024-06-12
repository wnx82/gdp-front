import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInfractionComponent } from './create-infraction.component';

describe('CreateInfractionComponent', () => {
  let component: CreateInfractionComponent;
  let fixture: ComponentFixture<CreateInfractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateInfractionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateInfractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
