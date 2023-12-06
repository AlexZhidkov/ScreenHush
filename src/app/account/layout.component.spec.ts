import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { MatIconRegistry } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DomSanitizer } from '@angular/platform-browser';
import { Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let iconRegistry: MatIconRegistry;
  let sanitizer: DomSanitizer;
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      imports: [MatCardModule, RouterModule, RouterTestingModule], // Add RouterModule and RouterTestingModule
      providers: [
        MatIconRegistry,
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustResourceUrl: (url: string) => url,
          },
        },
        Renderer2,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    iconRegistry = TestBed.inject(MatIconRegistry);
    sanitizer = TestBed.inject(DomSanitizer);
    renderer = TestBed.inject(Renderer2);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set pageTitle correctly', () => {
    const expectedTitle = "Let's get started";
    expect(component.pageTitle).toEqual(expectedTitle);
  });
});
