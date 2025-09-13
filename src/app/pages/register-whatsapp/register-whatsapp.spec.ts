import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWhatsapp } from './register-whatsapp';

describe('RegisterWhatsapp', () => {
  let component: RegisterWhatsapp;
  let fixture: ComponentFixture<RegisterWhatsapp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterWhatsapp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterWhatsapp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
