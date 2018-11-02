import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogfilmComponent } from './dialogfilm.component';

describe('DialogfilmComponent', () => {
  let component: DialogfilmComponent;
  let fixture: ComponentFixture<DialogfilmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogfilmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogfilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
