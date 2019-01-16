import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateAssessComponent } from './assess.component';

describe('EvaluateAssessComponent', () => {
  let component: EvaluateAssessComponent;
  let fixture: ComponentFixture<EvaluateAssessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateAssessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
