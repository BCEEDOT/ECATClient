import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpProviderAssessComponent } from './assess.component';

describe('AssessComponent', () => {
  let component: SpProviderAssessComponent;
  let fixture: ComponentFixture<SpProviderAssessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpProviderAssessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpProviderAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
